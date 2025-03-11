"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { jsPDF } from "jspdf";
import { parse } from "json2csv";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";

export default function BulkValidator() {
  const [files, setFiles] = useState<File[]>([]);
  const [nicList, setNicList] = useState<string[]>([]);
  const [validatedNICs, setValidatedNICs] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Upload a file to start...");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Handle file selection & auto-process
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    setFiles(uploadedFiles);
    if (uploadedFiles.length > 0) {
      await processFiles(uploadedFiles);
    }
  };

  // Process files and extract NICs
  const processFiles = async (files: File[]) => {
    setStatus("Processing files...");
    setProgress(0);
    let allNICs: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const nicData = await processFile(files[i]);
      allNICs = [...allNICs, ...nicData];
    }

    setNicList(allNICs);
    setStatus(`Processing complete! Found ${allNICs.length} NICs.`);
  };

  // Read & extract NICs from uploaded files
  const processFile = async (file: File) => {
    return new Promise<string[]>((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (!event.target?.result) return resolve([]);
        const result = event.target.result as string;
        const extractedNICs: string[] = [];

        if (file.type.includes("csv") || file.type.includes("excel")) {
          const workbook = XLSX.read(result, { type: "binary" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];

          data.flat().forEach((val) => {
            if (typeof val === "string" && val.match(/^\d{9}[VX]$/)) {
              extractedNICs.push(val);
            }
          });
        }
        resolve(extractedNICs);
      };
      reader.readAsBinaryString(file);
    });
  };

  // Validate NICs via API
  const validateNICs = async () => {
    if (!nicList.length) return;
    setStatus(`Validating ${nicList.length} NICs...`);
    setProgress(0);
    setValidatedNICs([]);

    for (let i = 0; i < nicList.length; i++) {
      try {
        const response = await fetch(`https://nic-val-api.onrender.com/test-url?id=${nicList[i]}&nicVal=NIC-VAL`);
        const data = await response.json();

        setValidatedNICs((prev) => [...prev, data]);
        setProgress(Math.round(((i + 1) / nicList.length) * 100));
      } catch (error) {
        console.error("Error validating NIC:", error);
      }
    }

    setStatus("Validation complete!");
  };


  const generatePDF = () => {
    const doc = new jsPDF();
    validatedNICs.forEach((nicData, index) => {
      const nic = nicList[index];
      doc.text(`NIC: ${nic}`, 20, 10 + index * 40);
      doc.text(`Valid: ${nicData.NIC?.valid ? "✅ Valid" : "❌ Invalid"}`, 20, 20 + index * 40);
      doc.text(`Birthdate: ${nicData.NIC?.birthDay || "N/A"}`, 20, 30 + index * 40);
      doc.text(`Age: ${nicData.NIC?.birthDay ? calculateAge(nicData.NIC.birthDay) : "N/A"}`, 20, 40 + index * 40);
      doc.text(`Gender: ${nicData.NIC?.gender || "N/A"}`, 20, 50 + index * 40);
    });
    doc.save('nic-report.pdf');
  };

  const generateCSV = () => {
    const data = validatedNICs.map((nicData, index) => ({
      NIC: nicList[index],
      Valid: nicData.NIC?.valid ? "✅ Valid" : "❌ Invalid",
      Birthdate: nicData.NIC?.birthDay || "N/A",
      Age: nicData.NIC?.birthDay ? `${calculateAge(nicData.NIC.birthDay)}` : "N/A",
      Gender: nicData.NIC?.gender || "N/A",
    }));

    const csv = parse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = 'nic-report.csv';
    link.click();
  };

  const generateExcel = () => {
    const data = validatedNICs.map((nicData, index) => ({
      NIC: nicList[index],
      Valid: nicData.NIC?.valid ? "✅ Valid" : "❌ Invalid",
      Birthdate: nicData.NIC?.birthDay || "N/A",
      Age: nicData.NIC?.birthDay ? `${calculateAge(nicData.NIC.birthDay)}` : "N/A",
      Gender: nicData.NIC?.gender || "N/A",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'NIC Report');
    XLSX.writeFile(wb, 'nic-report.xlsx');
  };

  return (
    <motion.div 
      className="p-6 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-4">Bulk NIC Validator</h1>

      {/* File Upload */}
      <Card className="w-full max-w-xl p-6">
        <CardHeader className="flex flex-col items-center">
          <Upload className="w-10 h-10 text-gray-500" />
          <h2 className="text-lg font-semibold mt-2">Upload Files</h2>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <input
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            multiple
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button onClick={() => fileInputRef.current?.click()} className="mt-2">
            Select Files
          </Button>
          {status && <p className="text-gray-600 mt-2">{status}</p>}
        </CardContent>
      </Card>

      {/* Progress Bar */}
      {nicList.length > 0 && (
        <div className="mt-6 w-full max-w-xl">
          <Progress value={progress} />
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-4 flex gap-4">
        <Button onClick={validateNICs} disabled={!nicList.length}>
          Validate NICs
        </Button>
      </div>

      {/* Validation Results */}
      {validatedNICs.length > 0 && (
        <motion.div 
          className="mt-6 w-full max-w-3xl overflow-y-auto max-h-96"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>NIC</TableCell>
                <TableCell>Valid</TableCell>
                <TableCell>Birthdate</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Gender</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {validatedNICs.map((nicData, index) => (
                <motion.tr 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TableCell>{nicList[index]}</TableCell>
                  <TableCell>{nicData.NIC?.valid ? "✅ Valid" : "❌ Invalid"}</TableCell>
                  <TableCell>{formatBirthDate(nicData.NIC?.birthDay) || "N/A"}</TableCell>
                  <TableCell>{nicData.NIC?.birthDay ? `${calculateAge(nicData.NIC.birthDay)} years` : "N/A"}</TableCell>
                  <TableCell>{nicData.NIC?.gender || "N/A"}</TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      )}
    </motion.div>
  );
}

function calculateAge(birthDay: { toString: () => string }) {
  const today = new Date();
  const birthDayStr = birthDay.toString(); // Ensure it's a string
  
  if (birthDayStr.length !== 8) return "N/A"; // Handle unexpected cases

  const birthYear = parseInt(birthDayStr.substring(4, 8), 10);
  const birthMonth = parseInt(birthDayStr.substring(2, 4), 10) - 1; // Month is 0-based in JS Date
  const birthDayNum = parseInt(birthDayStr.substring(0, 2), 10);

  const birthDate = new Date(birthYear, birthMonth, birthDayNum);
  let age = today.getFullYear() - birthDate.getFullYear();

  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
  ) {
    age--; // Adjust if birthday hasn't occurred yet this year
  }

  return age;
}

function formatBirthDate(dateStr: string) {
  if (!dateStr) return null;
  return `${dateStr.substring(0, 2)}-${dateStr.substring(2, 4)}-${dateStr.substring(4, 8)}`;
}