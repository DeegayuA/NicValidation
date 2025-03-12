"use client";

import React from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, TableCaption } from "@/components/ui/table";
import { useSettings } from "@/components/settings-provider";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";

// Function to calculate age from birthdate
const calculateAge = (birthDay: string) => {
  const today = new Date();
  const birthYear = parseInt(birthDay.substring(4, 8), 10);
  const birthMonth = parseInt(birthDay.substring(2, 4), 10) - 1;
  const birthDayNum = parseInt(birthDay.substring(0, 2), 10);

  const birthDate = new Date(birthYear, birthMonth, birthDayNum);
  let age = today.getFullYear() - birthDate.getFullYear();

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

  return `${day}/${month}/${year}`;
};

interface ValidatedNICTableProps {
  validatedNICs: any[];
  nicList: string[];
}

const ValidatedNICTable: React.FC<ValidatedNICTableProps> = ({ validatedNICs, nicList }) => {
  const { fontSize, lineHeight, letterSpacing, theme, highContrast, accentColor } = useSettings();

  const tableStyles = {
    fontSize: `${fontSize}px`,
    lineHeight: `${lineHeight}`,
    letterSpacing: `${letterSpacing}px`,
  };

  const headerStyles = {
    fontSize: `${fontSize*1.2}px`,
    lineHeight: `${lineHeight}`,
    letterSpacing: `${letterSpacing}px`,
  };

  const titleStyles = {
    fontSize: `${fontSize*1.5}px`,
    lineHeight: `${lineHeight}`,
    letterSpacing: `${letterSpacing}px`,
  };
  // Export functions
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
        <Button onClick={exportToCSV} variant={'secondary'}>Export as CSV</Button>
        <Button onClick={exportToExcel} variant={'secondary'}>Export as Excel</Button>
        <Button onClick={exportToPDF} variant={'secondary'}>Export as PDF</Button>
      </div>

      <Table className="flex flex-col mt-4 bg-background text-foreground rounded-md border mx-4 w-100" style={{ borderColor: accentColor }}>
        <TableCaption className="bg-background text-foreground font-bold" style={titleStyles}>Your validated NIC list.</TableCaption>
        <TableBody>
          <TableRow>
            <TableCell className="px-4 py-2 w-1/9 break-words text-wrap font-semibold" style={headerStyles}>#</TableCell>
            <TableCell className="px-4 py-2 w-3/9 break-words text-wrap font-semibold" style={headerStyles}>NIC</TableCell>
            <TableCell className="px-4 py-2 w-2/9 break-words text-wrap font-semibold" style={headerStyles}>Birth Date</TableCell>
            <TableCell className="px-4 py-2 w-2/9 break-words text-wrap font-semibold" style={headerStyles}>Age</TableCell>
            <TableCell className="px-4 py-2 w-1/9 break-words text-wrap font-semibold" style={headerStyles}>Gender</TableCell>
            <TableCell className="px-4 py-2 w-1/9 break-words text-wrap font-semibold" style={headerStyles}>Voting Eligibility</TableCell>
            <TableCell className="px-4 py-2 w-1/9 break-words text-wrap font-semibold" style={headerStyles}>Serial Number</TableCell>
            <TableCell className="px-4 py-2 w-1/9 break-words text-wrap font-semibold" style={headerStyles}>Check Digit</TableCell>
          </TableRow>
          {validatedNICs.map((nicData, index) => (
            <TableRow key={nicList[index]} className="border-t">
              <TableCell className="px-4 py-2" style={tableStyles}>{index + 1}</TableCell>
              <TableCell className="px-4 py-2 whitespace-nowrap overflow-hidden break-all" style={tableStyles}>{nicList[index] || "N/A"}</TableCell>
              <TableCell className="px-4 py-2" style={tableStyles}>{formatBirthday(nicData.NIC?.birthDay) || "N/A"}</TableCell>
              <TableCell className="px-4 py-2" style={tableStyles}>{nicData.NIC?.birthDay ? `${calculateAge(nicData.NIC.birthDay)}y` : "N/A"}</TableCell>
              <TableCell className="px-4 py-2" style={tableStyles}>{nicData.NIC?.gender || "N/A"}</TableCell>
              <TableCell className="px-4 py-2" style={tableStyles}>{nicData.NIC?.votingEligibility === true ? "Eligible" : "Not Eligible"}</TableCell>
              <TableCell className="px-4 py-2" style={tableStyles}>{nicData.NIC?.serialNumber || "N/A"}</TableCell>
              <TableCell className="px-4 py-2" style={tableStyles}>{nicData.NIC?.checkDigit || "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ValidatedNICTable;