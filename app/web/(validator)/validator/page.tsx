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

export default function Validator() {
    const { reducedMotion, fontSize, accentColor, highContrast, lineHeight, letterSpacing } = useSettings();
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState<{ city: string, country: string, latitude: string, longitude: string, region?: string } | null>(null);
    const [nicDetails, setNicDetails] = useState<any | null>(null);
    const [userIp, setUserIp] = useState<string | null>(null); // State for user's IP address

    const router = useRouter();
    const searchParams = useSearchParams();

    const inputValue = searchParams.get('input') || '';

    const calculateAge = (birthDay: { toString: () => any; }) => {
        const today = new Date();
        const birthDayStr = birthDay.toString();
        
        // Extract day, month, and year from the birthDay string (DDMMYYYY)
        const birthDayParsed = {
            day: parseInt(birthDayStr.substring(0, 2)),
            month: parseInt(birthDayStr.substring(2, 4)),
            year: parseInt(birthDayStr.substring(4, 8)),
        };
    
        const birthDate = new Date(birthDayParsed.year, birthDayParsed.month - 1, birthDayParsed.day);
        
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        const dayDifference = today.getDate() - birthDate.getDate();
    
        if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
            age--;
        }
    
        let month = monthDifference < 0 ? 12 + monthDifference : monthDifference;
        let day = dayDifference < 0 ? new Date(today.getFullYear(), today.getMonth(), 0).getDate() + dayDifference : dayDifference;
    
        return { age, month, day };
    };

    useEffect(() => {
        // Fetch user's IP address
        const fetchUserIp = async () => {
            try {
                const ipResponse = await fetch("https://api.ipify.org?format=json");
                const ipData = await ipResponse.json();
                setUserIp(ipData.ip);
            } catch (error) {
                console.error("Error fetching IP address:", error);
            }
        };

        fetchUserIp();

    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (inputValue && userIp) {
                // Use the user's IP in the fetch request
                try {
                    const response = await fetch(`https://nic-val-api.onrender.com/test-url?id=${inputValue}&nicVal=NIC-VAL&ip=${userIp}`);
                    const data = await response.json();

                    setLocation({
                        city: data.IP.city || "City not available",
                        country: data.IP.country || "Country not available",
                        latitude: data.IP.location.latitude || "Latitude not available",
                        longitude: data.IP.location.longitude || "Longitude not available",
                        region: data.IP.region || "N/A", // Handle region value
                    });

                    setNicDetails(data.NIC);
                } catch (error) {
                    console.error("Error fetching NIC data:", error);
                }
            }
        };

        fetchData();
    }, [inputValue, userIp]);

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text(`NIC Report for: ${inputValue}`, 20, 20);
        doc.text(`Location: ${location?.city || "N/A"}, ${location?.country || "N/A"}`, 20, 30);
        doc.text(`Latitude: ${location?.latitude || "N/A"}`, 20, 40);
        doc.text(`Longitude: ${location?.longitude || "N/A"}`, 20, 50);

        if (nicDetails) {
            doc.text(`Birthdate: ${nicDetails.birthYear}-${nicDetails.birthMonth}-${nicDetails.birthDay}`, 20, 60);
            doc.text(`Gender: ${nicDetails.gender || "N/A"}`, 20, 70);
            doc.text(`Serial Number: ${nicDetails.serialNumber || "N/A"}`, 20, 80);
            doc.text(`Check Digit: ${nicDetails.checkDigit || "N/A"}`, 20, 90);
        }

        doc.save('nic-report.pdf');
    };

    const generateCSV = () => {
        const data = [
            { "Field": "NIC", "Value": inputValue },
            { "Field": "Location", "Value": `${location?.city || "N/A"}, ${location?.country || "N/A"}` },
            { "Field": "Latitude", "Value": location?.latitude || "N/A" },
            { "Field": "Longitude", "Value": location?.longitude || "N/A" },
            { "Field": "Birthdate", "Value": `${nicDetails?.birthYear || "N/A"}-${nicDetails?.birthMonth || "N/A"}-${nicDetails?.birthDay || "N/A"}` },
            { "Field": "Gender", "Value": nicDetails?.gender || "N/A" },
            { "Field": "Serial Number", "Value": nicDetails?.serialNumber || "N/A" },
            { "Field": "Check Digit", "Value": nicDetails?.checkDigit || "N/A" },
        ];

        const csv = parse(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = 'nic-report.csv';
        link.click();
    };

    const generateExcel = () => {
        const data = [
            { "Field": "NIC", "Value": inputValue },
            { "Field": "Location", "Value": `${location?.city || "N/A"}, ${location?.country || "N/A"}` },
            { "Field": "Latitude", "Value": location?.latitude || "N/A" },
            { "Field": "Longitude", "Value": location?.longitude || "N/A" },
            { "Field": "Birthdate", "Value": `${nicDetails?.birthYear || "N/A"}-${nicDetails?.birthMonth || "N/A"}-${nicDetails?.birthDay || "N/A"}` },
            { "Field": "Gender", "Value": nicDetails?.gender || "N/A" },
            { "Field": "Serial Number", "Value": nicDetails?.serialNumber || "N/A" },
            { "Field": "Check Digit", "Value": nicDetails?.checkDigit || "N/A" },
        ];

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'NIC Report');
        XLSX.writeFile(wb, 'nic-report.xlsx');
    };

    return (
        <main className="bg-background p-6 mt-[2rem] md:mt-[4rem]" style={{ fontSize: `${fontSize / 16}rem` }}>
            <div className="p-4 sm:p-6" style={{ fontSize: `${fontSize / 16}rem` }}>
                <div className={`relative z-20 py-8 lg:py-5 w-auto mx-auto`}>
                    {inputValue && location && (
                        <div className="relative z-20 py-8 lg:py-5 max-w-7xl mx-auto">
                            <div className="px-8">
                                <h4 className={cn("text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white", playfairDisplay.className)} style={{ fontSize: `${fontSize / 16 * 1.875}rem`, lineHeight, letterSpacing: `${letterSpacing}px` }}>
                                    Data Received: {inputValue}
                                </h4>

                                {nicDetails && (
                                    <div className="mt-8">
                                        <h5 className="text-xl font-semibold text-center">NIC Details</h5>
                                        <ul className="text-center">
                                            <li><strong>Formatted NIC:</strong> {nicDetails.formatted || "N/A"}</li>
                                            <li><strong>Valid:</strong> {nicDetails.valid ? "Yes" : "No"}</li>
                                            <li><strong>Age:</strong> {nicDetails ? `${calculateAge(nicDetails.birthDay).age || "N/A"} years, ${calculateAge(nicDetails.birthDay).month || "N/A"} months, ${calculateAge(nicDetails.birthDay).day || "N/A"} days` : 'N/A'}</li>                                            <li><strong>Birth Day:</strong> {nicDetails?.birthDay ?
                                                `${nicDetails.birthDay.substring(0, 2)}-${nicDetails.birthDay.substring(2, 4)}-${nicDetails.birthDay.substring(4, 8)}`
                                                : 'DD-MM-YYYY'}</li>
                                            <li><strong>Gender:</strong> {nicDetails.gender || "N/A"}</li>
                                            <li><strong>Serial Number:</strong> {nicDetails.serialNumber || "N/A"}</li>
                                            <li><strong>Check Digit:</strong> {nicDetails.checkDigit || "N/A"}</li>
                                            <li><strong>Day of Year:</strong> {nicDetails.birthDayOfYear || "N/A"}</li>
                                            <li><strong>Voting Eligibility:</strong> {nicDetails.votingEligibility || "Unknown"}</li>
                                        </ul>

                                        <h5 className="text-xl font-semibold text-center mt-8">IP Location Details</h5>
                                        <ul className="text-center">
                                            <li><strong>IP Address:</strong> {userIp || "N/A"}</li>
                                            <li><strong>Region:</strong> {location.region || "N/A"}</li>
                                            <li><strong>City:</strong> {location.city || "N/A"}</li>
                                            <li><strong>Country:</strong> {location.country || "N/A"}</li>
                                            <li><strong>Latitude:</strong> {location.latitude || "N/A"}</li>
                                            <li><strong>Longitude:</strong> {location.longitude || "N/A"}</li>
                                        </ul>

                                        <div className="mt-8 flex justify-center gap-2">
                                            <Button onClick={generatePDF} variant="outline" size="sm">PDF</Button>
                                            <Button onClick={generateCSV} variant="outline" size="sm">CSV</Button>
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