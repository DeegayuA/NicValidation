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
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { pushToDatabase, fetchFromDatabase } from "@/app/firebase"; 

const playfairDisplay = Playfair_Display({ subsets: ['latin'] });

export default function Validator() {
    const { reducedMotion, fontSize, accentColor, highContrast, lineHeight, letterSpacing } = useSettings();
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState<{ city: string, country: string, latitude: string, longitude: string, region?: string } | null>(null);
    const [nicDetails, setNicDetails] = useState<any | null>(null);
    const [userIp, setUserIp] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();

    const inputValue = searchParams.get('input') || '';

    useEffect(() => {
        // Fetch user's IP address
        const fetchUserIp = async () => {
            try {
                const ipResponse = await fetch("https://api.ipify.org?format=json");
                const ipData = await ipResponse.json();
                setUserIp(ipData.ip);
            } catch (error) {
                console.error("Error fetching IP address:", error);
                setErrorMessage("Unable to fetch your IP address. Please check your connection.");
            }
        };

        fetchUserIp();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (inputValue && userIp) {
                try {
                    const response = await fetch(`https://nic-val-api.onrender.com/test-url?id=${inputValue}&nicVal=NIC-VAL&ip=${userIp}`);
                    const data = await response.json();

                    // Check if data.NIC exists before accessing properties
                    if (data.NIC) {
                        setLocation({
                            city: data.IP.city || "City not available",
                            country: data.IP.country || "Country not available",
                            latitude: data.IP.location.latitude || "Latitude not available",
                            longitude: data.IP.location.longitude || "Longitude not available",
                            region: data.IP.region || "N/A",
                        });

                        setNicDetails(data.NIC);

                        if (!data.NIC.error) {
                            const validData = {
                                nic: inputValue,
                                valid: data.NIC?.valid ?? false,
                                formatted: data.NIC?.formatted ?? "N/A",
                                birthYear: data.NIC?.birthYear ?? "N/A",
                                birthDayOfYear: data.NIC?.birthDayOfYear ?? "N/A",
                                birthDay: data.NIC?.birthDay ?? "N/A",
                                gender: data.NIC?.gender ?? "N/A",
                                votingEligibility: data.NIC?.votingEligibility ?? "N/A",
                                serialNumber: data.NIC?.serialNumber ?? "N/A",
                                checkDigit: data.NIC?.checkDigit ?? "N/A",
                                age: data.NIC?.age ?? "N/A",
                                ip: data.IP?.ip ?? "N/A",
                                city: data.IP?.city ?? "N/A",
                                region: data.IP?.region ?? "N/A",
                                country: data.IP?.country ?? "N/A",
                                location: data.IP?.location ?? { latitude: "N/A", longitude: "N/A" },
                                organization: data.IP?.organization ?? "N/A",
                                validationType: "single validation",
                                first_created_timestamp: Date.now(),
                                last_updated_timestamp: Date.now(),
                                duplicate_count: 1,
                            };
                            const validPath = `validated_nics/${inputValue}`;
                            const existingValidData = await fetchFromDatabase(validPath);

                            if (existingValidData) {
                                await pushToDatabase(validPath, {
                                    ...existingValidData,
                                    duplicate_count: existingValidData.duplicate_count + 1,
                                    last_updated_timestamp: Date.now(),
                                });
                            } else {
                                await pushToDatabase(validPath, validData); // Save new valid NIC data
                            }
                        } else {
                            // Show the error message from the API for invalid NIC
                            setErrorMessage(data.error || "Invalid NIC encountered.");
                            const invalidPath = `invalid_nics/${inputValue}`;
                            const existingInvalidData = await fetchFromDatabase(invalidPath);

                            if (existingInvalidData) {
                                await pushToDatabase(invalidPath, {
                                    ...existingInvalidData,
                                    duplicate_count: existingInvalidData.duplicate_count + 1,
                                    last_updated_timestamp: Date.now(),
                                });
                            } else {
                                await pushToDatabase(invalidPath, {
                                    nic: inputValue,
                                    error: data.error,
                                    first_created_timestamp: Date.now(),
                                    last_updated_timestamp: Date.now(),
                                    duplicate_count: 1,
                                });
                            }
                        }
                    } else {
                        setErrorMessage("NIC data is not available. Please check the input.");
                    }
                } catch (error) {
                    console.error("Error fetching NIC data:", error);
                    setErrorMessage("An error occurred while fetching NIC data. Please try again later.");
                } finally {
                    setLoading(false);  // Stop loading after validation process is completed
                }
            }
        };

        fetchData();
    }, [inputValue, userIp]);

    const generatePDF = async () => {
        const validPath = `validated_nics/${inputValue}`;
        const invalidPath = `invalid_nics/${inputValue}`;
        const validData = await fetchFromDatabase(validPath);
        const invalidData = await fetchFromDatabase(invalidPath);
        
        const doc = new jsPDF();
        doc.text(`NIC Report for: ${inputValue}`, 20, 20);
        doc.text(`Location: ${location?.city || "N/A"}, ${location?.country || "N/A"}`, 20, 30);
        doc.text(`Latitude: ${location?.latitude || "N/A"}`, 20, 40);
        doc.text(`Longitude: ${location?.longitude || "N/A"}`, 20, 50);

        if (validData) {
            doc.text(`Birthdate: ${validData.birthYear}-${validData.birthMonth}-${validData.birthDay}`, 20, 60);
            doc.text(`Gender: ${validData.gender || "N/A"}`, 20, 70);
            doc.text(`Serial Number: ${validData.serialNumber || "N/A"}`, 20, 80);
            doc.text(`Check Digit: ${validData.checkDigit || "N/A"}`, 20, 90);
        }

        if (invalidData) {
            doc.text(`Error: ${invalidData.error || "N/A"}`, 20, 100);
        }

        doc.save('nic-report.pdf');
    };

    const generateCSV = async () => {
        const validPath = `validated_nics/${inputValue}`;
        const invalidPath = `invalid_nics/${inputValue}`;
        const validData = await fetchFromDatabase(validPath);
        const invalidData = await fetchFromDatabase(invalidPath);

        const data = [
            { "Field": "NIC", "Value": inputValue },
            { "Field": "Location", "Value": `${location?.city || "N/A"}, ${location?.country || "N/A"}` },
            { "Field": "Latitude", "Value": location?.latitude || "N/A" },
            { "Field": "Longitude", "Value": location?.longitude || "N/A" },
            { "Field": "Birthdate", "Value": `${validData?.birthYear || "N/A"}-${validData?.birthMonth || "N/A"}-${validData?.birthDay || "N/A"}` },
            { "Field": "Gender", "Value": validData?.gender || "N/A" },
            { "Field": "Serial Number", "Value": validData?.serialNumber || "N/A" },
            { "Field": "Check Digit", "Value": validData?.checkDigit || "N/A" },
            { "Field": "Error", "Value": invalidData?.error || "N/A" },
        ];

        const csv = parse(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = 'nic-report.csv';
        link.click();
    };

    const generateExcel = async () => {
        const validPath = `validated_nics/${inputValue}`;
        const invalidPath = `invalid_nics/${inputValue}`;
        const validData = await fetchFromDatabase(validPath);
        const invalidData = await fetchFromDatabase(invalidPath);

        const data = [
            { "Field": "NIC", "Value": inputValue },
            { "Field": "Location", "Value": `${location?.city || "N/A"}, ${location?.country || "N/A"}` },
            { "Field": "Latitude", "Value": location?.latitude || "N/A" },
            { "Field": "Longitude", "Value": location?.longitude || "N/A" },
            { "Field": "Birthdate", "Value": `${validData?.birthYear || "N/A"}-${validData?.birthMonth || "N/A"}-${validData?.birthDay || "N/A"}` },
            { "Field": "Gender", "Value": validData?.gender || "N/A" },
            { "Field": "Serial Number", "Value": validData?.serialNumber || "N/A" },
            { "Field": "Check Digit", "Value": validData?.checkDigit || "N/A" },
            { "Field": "Error", "Value": invalidData?.error || "N/A" },
        ];

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "NIC Report");
        XLSX.writeFile(wb, 'nic-report.xlsx');
    };

    const formatDate = (rawDate: string) => {
        if (!rawDate || rawDate.length !== 8) return "N/A";

        const day = rawDate.substring(0, 2);  // Extract day (first two digits)
        const month = rawDate.substring(2, 4); // Extract month (next two digits)
        const year = rawDate.substring(4, 8);  // Extract year (last four digits)

        return `${day}/${month}/${year}`; // Return formatted date
    };

    return (
        <div className={cn("flex justify-center items-center p-10 mt-20 mx-10 mb-10", accentColor)}>
            {errorMessage && (
                <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                    <p className="font-semibold">Error:</p>
                    <p>{errorMessage}</p>
                </div>
            )}
            {nicDetails ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="w-full max-w-xl bg-secondary shadow-lg rounded-2xl px-8 py-4"
                >
                    <Card className="bg-secondary border rounded-xl">
                        <CardHeader className="text-center py-2">
                            <h1 className={cn("text-2xl font-semibold", highContrast ? "text-white" : "")}>
                                NIC Validation Results
                            </h1>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 p-4" style={{ fontSize, lineHeight, letterSpacing }}>
                            {/* Left Column: NIC Details */}
                            <div className="space-y-3">
                                <h2 className="text-lg font-semibold">NIC Information</h2>
                                <p><strong>NIC:</strong> {inputValue}</p>
                                <p><strong>Birthdate:</strong> {formatDate(nicDetails.birthDay)}</p>
                                <p><strong>Gender:</strong> {nicDetails.gender}</p>
                                <p><strong>Serial Number:</strong> {nicDetails.serialNumber}</p>
                                <p><strong>Check Digit:</strong> {nicDetails.checkDigit}</p>
                            </div>

                            {/* Right Column: Location Details */}
                            <div className="space-y-3">
                                <h2 className="text-lg font-semibold">Location Details</h2>
                                <p><strong>City:</strong> {location?.city}</p>
                                <p><strong>Country:</strong> {location?.country}</p>
                                <p><strong>Latitude:</strong> {location?.latitude}</p>
                                <p><strong>Longitude:</strong> {location?.longitude}</p>
                                <p><strong>Region:</strong> {location?.region || "N/A"}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                        <Button variant="outline" onClick={generatePDF}>Download PDF</Button>
                        <Button variant="outline" onClick={generateCSV}>Download CSV</Button>
                        <Button variant="outline" onClick={generateExcel}>Download Excel</Button>
                    </div>
                </motion.div>
            ) : (
                <Loader loadingStates={[
                    { text: "Verifying NIC format..." },
                    { text: "Extracting details from NIC..." },
                    { text: "Ensuring accuracy and security..." },
                    { text: "Done! Your Report is ready..." },
                ]} loading={loading} duration={2000} />
            )}
        </div>
    );
}