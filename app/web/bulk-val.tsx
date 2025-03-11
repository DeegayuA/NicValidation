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

interface BulkValidatorPageProps {
  files: File[];
  onFilesChange: (hasFiles: boolean) => void;
}

// Function to calculate age (same as before)

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
    return new Promise<string[]>((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (!event.target?.result) return resolve([]);
        const result = event.target.result as ArrayBuffer;
        const extractedNICs: string[] = [];
  
        if (file.type.includes("csv") || file.type.includes("excel")) {
          const workbook = XLSX.read(result, { type: "array" });
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
        }
        resolve(extractedNICs);
      };
      reader.readAsArrayBuffer(file);
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
      className={`pb-4 flex flex-col items-center ${highContrast ? 'bg-black text-white' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.5 }}
      style={{
        fontSize: `${fontSize}px`,
        lineHeight: `${lineHeight}`,
        letterSpacing: `${letterSpacing}px`,
      }}
    >
      <CardContent className="flex flex-col items-center w-xl">
        {status && <p className="text-primary font-bold">{status}</p>}
        <FileUpload onChange={handleFileUpload} />
      </CardContent>

      {nicList.length > 0 && (
        <div className="mt-6 w-full max-w-xl">
          <Progress value={progress} />
        </div>
      )}

      {validatedNICs.length > 0 && (
        <div>
          <ValidatedNICTable validatedNICs={validatedNICs} nicList={[]} />
        </div>
      )}
    </motion.div>
  );
}