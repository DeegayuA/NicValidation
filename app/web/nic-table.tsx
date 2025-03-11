"use client";

import React from "react";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { useSettings } from "@/components/settings-provider"; // Import settings
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";

// Function to calculate age from birthdate
const calculateAge = (birthDay: string) => {
  const today = new Date();
  const birthYear = parseInt(birthDay.substring(4, 8), 10);
  const birthMonth = parseInt(birthDay.substring(2, 4), 10) - 1; // Month is 0-indexed
  const birthDayNum = parseInt(birthDay.substring(0, 2), 10);

  const birthDate = new Date(birthYear, birthMonth, birthDayNum);
  let age = today.getFullYear() - birthDate.getFullYear();

  // Adjust age if the birthday hasn't occurred yet this year
  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

// Function to format birthday to a human-readable format
const formatBirthday = (birthDay: string) => {
  if (!birthDay) return "N/A";

  const day = birthDay.substring(0, 2);
  const month = birthDay.substring(2, 4);
  const year = birthDay.substring(4, 8);

  return `${day}/${month}/${year}`; // Example format: 01/01/1990
};

interface ValidatedNICTableProps {
  validatedNICs: any[];
  nicList: string[];
}

const ValidatedNICTable: React.FC<ValidatedNICTableProps> = ({ validatedNICs, nicList }) => {
  const { fontSize, lineHeight, letterSpacing, theme, highContrast } = useSettings(); // Get settings from context

  // Define the theme-based text and background color styles
  const tableStyles = {
    fontSize: `${fontSize}px`,
    lineHeight: `${lineHeight}`,
    letterSpacing: `${letterSpacing}px`,
    backgroundColor: 'bg-secondary',
    color: highContrast ? '#ffffff' : theme === 'light' ? '#000000' : '#ffffff', 
  };

  // Export to CSV function
  const exportToCSV = () => {
    if (validatedNICs.length === 0) {
      alert("No data to export.");
      return;
    }

    const data = validatedNICs.map((nicData, index) => ({
      "#": index + 1,
      NIC: nicList[index],
      Valid: nicData.NIC?.valid ? "✅ Valid" : "❌ Invalid",
      "Birth Year": nicData.NIC?.birthYear || "N/A",
      "Birth Date": formatBirthday(nicData.NIC?.birthDay),
      Age: nicData.NIC?.birthDay ? `${calculateAge(nicData.NIC.birthDay)} years` : "N/A",
      Gender: nicData.NIC?.gender || "N/A",
      "Voting Eligibility": nicData.NIC?.votingEligibility === true ? "Eligible" : "Not Eligible",
      "Serial Number": nicData.NIC?.serialNumber || "N/A",
      "Check Digit": nicData.NIC?.checkDigit || "N/A",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Validated NICs");
    XLSX.writeFile(wb, "validated_nics.csv");
  };

  // Export to Excel function
  const exportToExcel = () => {
    if (validatedNICs.length === 0) {
      alert("No data to export.");
      return;
    }

    const data = validatedNICs.map((nicData, index) => ({
      "#": index + 1,
      NIC: nicList[index],
      Valid: nicData.NIC?.valid ? "✅ Valid" : "❌ Invalid",
      "Birth Year": nicData.NIC?.birthYear || "N/A",
      "Birth Date": formatBirthday(nicData.NIC?.birthDay),
      Age: nicData.NIC?.birthDay ? `${calculateAge(nicData.NIC.birthDay)} years` : "N/A",
      Gender: nicData.NIC?.gender || "N/A",
      "Voting Eligibility": nicData.NIC?.votingEligibility === true ? "Eligible" : "Not Eligible",
      "Serial Number": nicData.NIC?.serialNumber || "N/A",
      "Check Digit": nicData.NIC?.checkDigit || "N/A",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Validated NICs");
    XLSX.writeFile(wb, "validated_nics.xlsx");
  };

  // Export to PDF function
  const exportToPDF = () => {
    if (validatedNICs.length === 0) {
      alert("No data to export.");
      return;
    }

    const doc = new jsPDF();
    autoTable(doc, {
      head: [["#", "NIC", "Valid", "Birth Year", "Birth Date", "Age", "Gender", "Voting Eligibility", "Serial Number", "Check Digit"]],
      body: validatedNICs.map((nicData, index) => [
        index + 1,
        nicList[index],
        nicData.NIC?.valid ? "✅ Valid" : "❌ Invalid",
        nicData.NIC?.birthYear || "N/A",
        formatBirthday(nicData.NIC?.birthDay),
        nicData.NIC?.birthDay ? `${calculateAge(nicData.NIC.birthDay)} years` : "N/A",
        nicData.NIC?.gender || "N/A",
        nicData.NIC?.votingEligibility === true ? "Eligible" : "Not Eligible",
        nicData.NIC?.serialNumber || "N/A",
        nicData.NIC?.checkDigit || "N/A",
      ]),
    });
    doc.save("validated_nics.pdf");
  };

  return (
    <div>
      <div className="mt-4 space-x-4">
        <Button onClick={exportToCSV}>Export as CSV</Button>
        <Button onClick={exportToExcel}>Export as Excel</Button>
        <Button onClick={exportToPDF}>Export as PDF</Button>
      </div>

      <Table className="flex flex-col" style={tableStyles}>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>NIC</TableCell>
            <TableCell>Valid</TableCell>
            <TableCell>Birth Year</TableCell>
            <TableCell>Birth Date</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Voting Eligibility</TableCell>
            <TableCell>Serial Number</TableCell>
            <TableCell>Check Digit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {validatedNICs.map((nicData, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{nicList[index]}</TableCell>
              <TableCell>{nicData.NIC?.valid ? "✅ Valid" : "❌ Invalid"}</TableCell>
              <TableCell>{nicData.NIC?.birthYear || "N/A"}</TableCell>
              <TableCell>{formatBirthday(nicData.NIC?.birthDay)}</TableCell>
              <TableCell>{nicData.NIC?.birthDay ? `${calculateAge(nicData.NIC.birthDay)} years` : "N/A"}</TableCell>
              <TableCell>{nicData.NIC?.gender || "N/A"}</TableCell>
              <TableCell>
                {(() => {
                  if (nicData.NIC?.votingEligibility === true) return "Eligible";
                  if (nicData.NIC?.votingEligibility === false) return "Not Eligible";
                  return "Unknown";
                })()}
              </TableCell>
              <TableCell>{nicData.NIC?.serialNumber || "N/A"}</TableCell>
              <TableCell>{nicData.NIC?.checkDigit || "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ValidatedNICTable;