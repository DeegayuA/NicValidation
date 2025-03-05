'use client'

import { Playfair_Display } from "next/font/google";
import { useSettings } from "@/components/settings-provider";
import React, { useEffect, useState } from "react";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from 'next/navigation';
import { jsPDF } from "jspdf";
import { parse } from 'json2csv';
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";

const playfairDisplay = Playfair_Display({ subsets: ['latin'] });

const loadingStates = [
    {
        text: "Loading Started...",
    },
    {
        text: "Verifying NIC format...",
    },
    {
        text: "Extracting details from NIC...",
    },
    {
        text: "Cross-checking validity...",
    },
    {
        text: "Ensuring accuracy and security...",
    },
    {
        text: "Done! Your Report is ready...",
    },
];

export default function Home() {
    const { reducedMotion, fontSize, accentColor, highContrast, lineHeight, letterSpacing } = useSettings();
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState<{ city: string, country: string, latitude: string, longitude: string } | null>(null);
    interface NicDetails {
        birthYear: number;
        birthMonth: number;
        birthDay: number;
        gender: string;
        serialNumber: string;
        checkDigit: string;
        voteEligibility?: string;
    }
    
    const [nicDetails, setNicDetails] = useState<NicDetails | null>(null);  // State for storing NIC details
    const router = useRouter();
    const searchParams = useSearchParams();

    const inputValue = searchParams.get('input') || '';

    useEffect(() => {
        const loadingTimeout = setTimeout(() => {
            setLoading(false);
        }, 3000);

        const fetchLocation = async () => {
            try {
                const response = await fetch("https://ipinfo.io/json?token=a656d399b8381d"); // Replace with your token from ipinfo.io
                const data = await response.json();
                const [latitude, longitude] = data.loc.split(',');
                setLocation({
                    city: data.city || "City not available",
                    country: data.country || "Country not available",
                    latitude: latitude || "Latitude not available",
                    longitude: longitude || "Longitude not available"
                });
            } catch (error) {
                console.error("Error fetching location:", error);
                setLocation({
                    city: "City not available",
                    country: "Country not available",
                    latitude: "Latitude not available",
                    longitude: "Longitude not available"
                });
            }
        };

        fetchLocation();

        if (inputValue) {
            try {
                const details = extractNicDetails(inputValue);
                setNicDetails(details);
            } catch (error) {
                console.error("Error extracting NIC details:", error);
            }
        }

        return () => {
            clearTimeout(loadingTimeout);
        };
    }, [inputValue]);

    function extractNicDetails(nic: string) {
        const oldNicPattern = /^(\d{2})(\d{3})(\d{3})(\d{1})([VX])$/i;
        const newNicPattern = /^(\d{4})(\d{3})(\d{4})(\d{1})$/;
      
        let details: NicDetails;
      
        let match = nic.match(oldNicPattern);
        if (match) {
            const yearPrefix = match[1];
            const dayOfYear = parseInt(match[2], 10);
            const serialNumber = match[3];
            const checkDigit = match[4];
            const voteEligibility = match[5];
      
            const birthYear = 1900 + parseInt(yearPrefix, 10);
            const gender = dayOfYear > 500 ? 'Female' : 'Male';
            const adjustedDayOfYear = gender === 'Female' ? dayOfYear - 500 : dayOfYear;
      
            const date = new Date(birthYear, 0);
            date.setDate(adjustedDayOfYear - 1);
            
            const birthMonth = date.getMonth() + 1;
            const birthDay = date.getDate();
      
            details = {
                birthYear,
                birthMonth,
                birthDay,
                gender,
                serialNumber,
                checkDigit,
                voteEligibility,
            };
        } else {
            match = nic.match(newNicPattern);
            if (match) {
                const birthYear = parseInt(match[1], 10);
                const dayOfYear = parseInt(match[2], 10);
                const serialNumber = match[3];
                const checkDigit = match[4];
        
                const gender = dayOfYear > 500 ? 'Female' : 'Male';
                const adjustedDayOfYear = gender === 'Female' ? dayOfYear - 500 : dayOfYear;
        
                const date = new Date(birthYear, 0);
                date.setDate(adjustedDayOfYear - 1);
                
                const birthMonth = date.getMonth() + 1;
                const birthDay = date.getDate();
        
                details = {
                    birthYear,
                    birthMonth,
                    birthDay,
                    gender,
                    serialNumber,
                    checkDigit,
                };
            } else {
                throw new Error('Invalid NIC format');
            }
        }
      
        return details;
    }

    // PDF Generation Function
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text(`NIC Report for: ${inputValue}`, 20, 20);
        doc.text(`Location: ${location?.city}, ${location?.country}`, 20, 30);
        doc.text(`Latitude: ${location?.latitude}`, 20, 40);
        doc.text(`Longitude: ${location?.longitude}`, 20, 50);

        if (nicDetails) {
            doc.text(`Birthdate: ${nicDetails.birthYear}-${nicDetails.birthMonth}-${nicDetails.birthDay}`, 20, 60);
            doc.text(`Gender: ${nicDetails.gender}`, 20, 70);
            doc.text(`Serial Number: ${nicDetails.serialNumber}`, 20, 80);
            doc.text(`Check Digit: ${nicDetails.checkDigit}`, 20, 90);
        }

        doc.save('nic-report.pdf');
    };

    // CSV Generation Function
    const generateCSV = () => {
        const data = [
            { "Field": "NIC", "Value": inputValue },
            { "Field": "Location", "Value": `${location?.city}, ${location?.country}` },
            { "Field": "Latitude", "Value": location?.latitude },
            { "Field": "Longitude", "Value": location?.longitude },
            { "Field": "Birthdate", "Value": `${nicDetails?.birthYear}-${nicDetails?.birthMonth}-${nicDetails?.birthDay}` },
            { "Field": "Gender", "Value": nicDetails?.gender },
            { "Field": "Serial Number", "Value": nicDetails?.serialNumber },
            { "Field": "Check Digit", "Value": nicDetails?.checkDigit },
        ];

        const csv = parse(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = 'nic-report.csv';
        link.click();
    };

    // Excel Generation Function
    const generateExcel = () => {
        const data = [
            { "Field": "NIC", "Value": inputValue },
            { "Field": "Location", "Value": `${location?.city}, ${location?.country}` },
            { "Field": "Latitude", "Value": location?.latitude },
            { "Field": "Longitude", "Value": location?.longitude },
            { "Field": "Birthdate", "Value": `${nicDetails?.birthYear}-${nicDetails?.birthMonth}-${nicDetails?.birthDay}` },
            { "Field": "Gender", "Value": nicDetails?.gender },
            { "Field": "Serial Number", "Value": nicDetails?.serialNumber },
            { "Field": "Check Digit", "Value": nicDetails?.checkDigit },
        ];

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'NIC Report');
        XLSX.writeFile(wb, 'nic-report.xlsx');
    };

    return (
        <main className="bg-background p-6 mt-[2rem] md:mt-[4rem]" style={{ fontSize: `${fontSize / 16}rem` }}>
            <div
                className="p-4 sm:p-6"
                style={{
                    fontSize: `${fontSize / 16}rem`,
                }}
            >
                {/* Only render loader if loading is true */}
                {loading && (
                    <Loader loadingStates={loadingStates} loading={loading} duration={500} />
                )}

                {/* Content is hidden if loading is true */}
                <div
                    className={`relative z-20 py-8 lg:py-5 max-w-7xl mx-auto ${loading ? 'hidden' : ''}`}
                >
                    {inputValue && !loading && location && (
                        <div
                            className="relative z-20 py-8 lg:py-5 max-w-7xl mx-auto"
                        >
                            <div className="px-8">
                                <h4 className={cn("text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white", playfairDisplay.className)} style={{ fontSize: `${fontSize / 16 * 1.875}rem`, lineHeight, letterSpacing: `${letterSpacing}px` }}>
                                    Data Received: {inputValue}
                                </h4>

                                <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300" style={{ fontSize: `${fontSize / 16 * 0.875}rem`, lineHeight, letterSpacing: `${letterSpacing}px` }}>
                                    The input value from the URL is: {inputValue}. <br />
                                    <strong>Location: {location.city}, {location.country}</strong><br />
                                    <strong>Latitude: {location.latitude}</strong><br />
                                    <strong>Longitude: {location.longitude}</strong>
                                </p>

                                {nicDetails && (
                                    <div className="mt-8">
                                        <h5 className="text-xl font-semibold text-center">NIC Details</h5>
                                        <ul className="text-center">
                                            <li><strong>Birthday:</strong> {nicDetails.birthYear} {nicDetails.birthMonth.toString().padStart(2, '0')} {nicDetails.birthDay.toString().padStart(2, '0')}</li>
                                            <li><strong>Gender:</strong> {nicDetails.gender}</li>
                                            <li><strong>Serial:</strong> {nicDetails.serialNumber}</li>
                                            <li><strong>Check Digit:</strong> {nicDetails.checkDigit}</li>
                                            {nicDetails.voteEligibility && <li><strong>Vote Eligibility:</strong> {nicDetails.voteEligibility}</li>}
                                        </ul>
                                        <div className="mt-8 flex justify-center gap-2">
                                            <Button onClick={generatePDF} variant="outline" size="sm" >PDF</Button>
                                            <Button onClick={generateCSV}  variant="outline" size="sm">CSV</Button>
                                            <Button onClick={generateExcel} variant="outline" size="sm">Excel</Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}