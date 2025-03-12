'use client'
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useSettings } from "@/components/settings-provider";
import { CardContent } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import ValidatedNICTable from "./nic-table";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as pdfjsLib from "pdfjs-dist";

interface BulkValidatorPageProps {
  files: File[];
  onFilesChange: (hasFiles: boolean) => void;
}

// Function to calculate age
function calculateAge(birthDay: { toString: () => string }) {
  const today = new Date();
  const birthDayStr = birthDay.toString();
  if (birthDayStr.length !== 8) return "N/A";

  const birthYear = parseInt(birthDayStr.substring(4, 8), 10);
  const birthMonth = parseInt(birthDayStr.substring(2, 4), 10) - 1;
  const birthDayNum = parseInt(birthDayStr.substring(0, 2), 10);

  const birthDate = new Date(birthYear, birthMonth, birthDayNum);
  let age = today.getFullYear() - birthDate.getFullYear();

  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

export default function BulkValidatorPage({ onFilesChange }: BulkValidatorPageProps): JSX.Element {
  const { theme, fontSize, lineHeight, reducedMotion, highContrast, accentColor, letterSpacing } = useSettings();
  const [files, setFiles] = useState<File[]>([]);
  const [nicList, setNicList] = useState<string[]>([]);
  const [validatedNICs, setValidatedNICs] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Upload a file to start...");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    onFilesChange(files.length > 0);
  }, [files, onFilesChange]);

  const handleFileUpload = async (uploadedFiles: File[]) => {
    setFiles(uploadedFiles);
    if (uploadedFiles.length > 0) {
      await processFiles(uploadedFiles);
    }
  };

  const processFiles = async (files: File[]) => {
    setStatus("Processing files...");
    setProgress(0);
    let allNICs: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const nicData = await processFile(files[i]);
      allNICs = [...allNICs, ...nicData];
    }

    setNicList((prevList) => [...prevList, ...allNICs]);
    setStatus(`Processing complete! Found ${allNICs.length} NICs.`);
    validateNICs(allNICs);
  };

  const processFile = async (file: File) => {
    return new Promise<string[]>((resolve, reject) => {
      const reader = new FileReader();
      const extractedNICs: string[] = [];
  
      // Allowed file types
      const allowedTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
        "application/pdf",
      ];
  
      if (!allowedTypes.includes(file.type)) {
        setStatus(`Error: Unsupported file type - ${file.name}`);
        reject(`Unsupported file type: ${file.name}`);
        return;
      }
  
      reader.onload = async (event) => {
        if (!event.target?.result) return resolve([]);
  
        const result = event.target.result;
  
        if (file.type === "text/csv") {
          // Process CSV (read as text)
          const workbook = XLSX.read(result as string, { type: "string" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];
  
          data.flat().forEach((val) => {
            if (typeof val === "string") {
              // Improved regex to capture both NIC formats:
              // - 9-digit NIC + V/X (e.g., 123456789V, 123456789X, 123456789v, 123456789x)
              // - 12-digit NIC (e.g., 200012345678)
              const matches = val.match(/(?:\b|^)(\d{9}[VXvx]|\d{12})(?:\b|$)/g);
              
              if (matches) {
                extractedNICs.push(...matches);
              }
            }
          });
        } else if (
          file.type === "application/vnd.ms-excel" ||
          file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
          // Process Excel
          const workbook = XLSX.read(result as string, { type: "binary" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];
  
          data.flat().forEach((val) => {
            if (typeof val === "string") {
              const matches = val.match(/\b\d{9}[VXvx]\b|\b\d{12}\b/g);
              if (matches) {
                extractedNICs.push(...matches);
              }
            }
          });
        } else if (file.type === "application/pdf") {
          // Process PDF using pdfjs
          const pdfData = new Uint8Array(result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
          let textContent = "";
  
          for (let i = 0; i < pdf.numPages; i++) {
            const page = await pdf.getPage(i + 1);
            const text = await page.getTextContent();
            textContent += text.items.map((item: any) => item.str).join(" ");
          }
  
          // Extract NICs from text
          const matches = textContent.match(/\b\d{9}[VXvx]\b|\b\d{12}\b/g);
          if (matches) {
            extractedNICs.push(...matches);
          }
        }
  
        resolve(extractedNICs);
      };
  
      if (file.type === "application/pdf") {
        reader.readAsArrayBuffer(file);
      } else if (file.type === "text/csv") {
        reader.readAsText(file); // Read CSV as text
      } else {
        reader.readAsBinaryString(file); // Read Excel as binary
      }
    });
  };

  const validateNICs = async (nicList: string[]) => {
    if (!nicList.length) return;
    setStatus(`Validating ${nicList.length} NICs...`);
    setProgress(0);

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

  // Export functions
  const exportToCSV = () => {
    const ws = XLSX.utils.json_to_sheet(validatedNICs);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Validated NICs");
    XLSX.writeFile(wb, "validated_nics.csv");
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(validatedNICs);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Validated NICs");
    XLSX.writeFile(wb, "validated_nics.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["NIC", "Status", "Details"]],
      body: validatedNICs.map((nic) => [nic.nic, nic.status, nic.details]),
    });
    doc.save("validated_nics.pdf");
  };

  return (
    <motion.div
      className={`pb-4 flex flex-col items-center`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.5 }}
      style={{
        fontSize: `${fontSize}px`,
        lineHeight: `${lineHeight}`,
        letterSpacing: `${letterSpacing}px`,
      }}
    >
      <CardContent className="flex flex-col items-center w-full">
  {files.length > 0 && status && <p className="text-primary font-bold mt-2" style={{
        fontSize: `${fontSize*1.5}px`,
        lineHeight: `${lineHeight}`,
        letterSpacing: `${letterSpacing}px`,
      }}>{status}</p>}
        <FileUpload onChange={handleFileUpload} />
      </CardContent>

      {nicList.length > 0 && (
        <div className="w-full max-w-xl">
          <Progress value={progress} />
        </div>
      )}

      {validatedNICs.length > 0 && (
        <div>
          <ValidatedNICTable validatedNICs={validatedNICs} nicList={nicList} />
        </div>
      )}
    </motion.div>
  );
}