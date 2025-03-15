import { useState, useRef, useEffect, JSX } from "react";
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
import { database, fetchFromDatabase, pushToDatabase } from "@/app/firebase"; // Import database functions
import { ref, set, update } from "firebase/database";

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

interface BulkValidatorPageProps {
  onFilesChange: (hasFiles: boolean) => void;
}

export default function BulkValidatorPage({ onFilesChange }: BulkValidatorPageProps): JSX.Element {
  const { theme, fontSize, lineHeight, reducedMotion, highContrast, accentColor, letterSpacing } = useSettings();
  const [files, setFiles] = useState<File[]>([]);
  const [nicList, setNicList] = useState<string[]>([]);
  const [validatedNICs, setValidatedNICs] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Upload a file to start...");
  const [invalidNICs, setInvalidNICs] = useState<any[]>([]);
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
    let validCount = 0;
    let invalidCount = 0;
  
    for (const element of files) {
      const nicData = await processFile(element);
      allNICs = [...allNICs, ...nicData];
  
      // Store uploaded file details in Firebase
      const filePath = `uploaded_files/${element.name.replace(/[.#$$begin:math:display$$end:math:display$]/g, "_")}`;
      const fileData = {
        fileName: element.name,
        total_nics: nicData.length,
        valid_nics: validCount,
        invalid_nics: invalidCount,
        first_created_timestamp: Date.now(),
        last_upload_timestamp: Date.now(),
        duplicate_count: 1,
        nics: nicData, // Save the NICs under the uploaded file
      };
  
      const existingFileData = await fetchFromDatabase(filePath);
      const existingNICs = Array.isArray(existingFileData?.nics) ? existingFileData.nics : [];
      allNICs = Array.from(new Set([...allNICs, ...existingNICs]));
  
      await pushToDatabase(filePath, fileData); // Save file data along with NICs
      }
  
    setNicList((prevList) => [...prevList, ...allNICs]);
    setStatus(`Processing complete! Found ${allNICs.length} NICs.`);
    validateNICs(allNICs);
  };

  const processFile = async (file: File) => {
    return new Promise<string[]>((resolve, reject) => {
      const reader = new FileReader();
      const extractedNICs: string[] = [];

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

        // Extract NICs based on file type
        if (file.type === "text/csv" || file.type === "application/vnd.ms-excel" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
          const workbook = XLSX.read(result as string, { type: "string" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];

          data.flat().forEach((val) => {
            if (typeof val === "string" && val.match(/\b\d{9}[VXvx]\b/g)) {
              extractedNICs.push(val);
            }
            if (typeof val === "number" && /^\d{12}$/.test(String(val))) {
              if (typeof val === "number") {
                extractedNICs.push(String(val));
              }
            }
          });
        } else if (file.type === "application/pdf") {
          const pdfData = new Uint8Array(result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
          let textContent = "";

          for (let i = 0; i < pdf.numPages; i++) {
            const page = await pdf.getPage(i + 1);
            const text = await page.getTextContent();
            textContent += text.items.map((item: any) => item.str).join(" ");
          }

          const matches = textContent.match(/\b\d{9}[VXvx]\b/g);
          if (matches) extractedNICs.push(...matches);
        }

        resolve(extractedNICs);
      };

      reader.readAsBinaryString(file);
    });
  };

  const validateNICs = async (nicList: string[]) => {
    if (!nicList.length) return;

    setStatus(`Validating ${nicList.length} NICs...`);
    setProgress(0);
    let validCount = 0;
    let invalidCount = 0;
    const invalidNICsTemp = [];

    // Fetch all NIC data in a batch
    const responses = await Promise.all(nicList.map(nic => fetch(`https://nic-val-api.onrender.com/test-url?id=${nic}&nicVal=NIC-VAL`)));
    const dataList = await Promise.all(responses.map(response => response.json()));

    for (let i = 0; i < nicList.length; i++) {
      const nic = nicList[i];
      const data = dataList[i];

      console.log(`Validating NIC: ${nic}`);
      console.log(`Validation response for ${nic}:`, data);

      const validPath = `validated_nics/${nic}`;
      const existingValidData = await fetchFromDatabase(validPath);
      
      if (existingValidData) {
        setValidatedNICs((prev) => [...prev, { ...data, existsInDB: true }]);
        continue; // Skip processing if NIC already exists in the database
      }

      if (data.error) {
        invalidNICsTemp.push({ nic: nic, error: data.error });
        invalidCount++;

        const invalidPath = `invalid_nics/${nic}`;
        const existingInvalidData = await fetchFromDatabase(invalidPath);

        if (existingInvalidData) {
          console.log(`Updating invalid NIC data for ${nic}`);
          await pushToDatabase(invalidPath, {
            ...existingInvalidData,
            duplicate_count: existingInvalidData.duplicate_count + 1,
            last_updated_timestamp: Date.now(),
          });
        } else {
          console.log(`Pushing new invalid NIC data for ${nic}`);
          await pushToDatabase(invalidPath, {
            nic: nic,
            error: data.error,
            first_created_timestamp: Date.now(),
            last_updated_timestamp: Date.now(),
            duplicate_count: 1,
          });
        }
      } else {
        const validData = {
          nic: nic,
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
          validationType: "bulk validation",
          first_created_timestamp: Date.now(),
          last_updated_timestamp: Date.now(),
          duplicate_count: 1,
        };

        console.log(`Pushing new valid NIC data for ${nic}`);
        await setToDatabase(validPath, validData);
        setValidatedNICs((prev) => [...prev, { ...data, existsInDB: false }]);
        validCount++;
      }

      setProgress(Math.round(((i + 1) / nicList.length) * 100));
      setStatus(`Validating ${validCount + invalidCount} NICs... ${validCount} valid, ${invalidCount} invalid`);
    }

    setInvalidNICs(invalidNICsTemp);
    setStatus(`Validation complete! ${invalidCount} NICs are invalid.`);
  };

  // Push to Firebase - Use set for new data and update for existing data
  const setToDatabase = async (path: string, data: any) => {
    const dataRef = ref(database, path);
    try {
      console.log(`Setting data at path: ${path}`);
      console.log(`Data being set:`, data);
      await set(dataRef, data);
      console.log("Data saved successfully to Firebase");
    } catch (error) {
      console.error("Error saving data to Firebase:", error);
    }
  };

  const updateToDatabase = async (path: string, data: any) => {
    const dataRef = ref(database, path);
    try {
      console.log(`Updating data at path: ${path}`);
      console.log(`Data being updated:`, data);
      await update(dataRef, data);
      console.log("Data updated successfully to Firebase");
    } catch (error) {
      console.error("Error updating data in Firebase:", error);
    }
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
        <FileUpload onChange={handleFileUpload} />
        {files.length > 0 && status && <p className="text-primary font-bold mt-2" style={{
          fontSize: `${fontSize * 1.5}px`,
          lineHeight: `${lineHeight}`,
          letterSpacing: `${letterSpacing}px`,
        }}>{status}</p>}
      </CardContent>

      {(invalidNICs.length > 0 || validatedNICs.length > 0) && (

        <div className="w-100 mx-4 p-4 my-4 rounded-md">
          <h2 className="font-bold">NIC Validation Results</h2>

          {(invalidNICs.length > 0 || validatedNICs.length > 0) && (
            <div className="bg-gray-100 p-4 my-4 rounded-md">
              <h2 className="font-bold">NIC Validation Results</h2>
              <div className="flex flex-wrap justify-between gap-2 w-full">

                {/* Invalid NICs */}
                {invalidNICs.length > 0 && invalidNICs.map((item, index) => (
                  <div key={index} className="bg-red-400 text-white p-2 rounded-md flex-1 text-center">
                    {item.nic} - {item.error}
                  </div>
                ))}

                {/* NICs Found in Database (Warning) */}
                {validatedNICs.filter(item => item.existsInDB).length > 0 && validatedNICs.filter(item => item.existsInDB).map((item, index) => (
                  <div key={index} className="bg-yellow-400 text-white p-2 rounded-md flex-1 text-center">
                    {item.nic} - {item.nic} already exists in DB
                  </div>
                ))}

                {/* Valid NICs Saved to Database (Success) */}
                {validatedNICs.filter(item => !item.existsInDB).length > 0 && validatedNICs.filter(item => !item.existsInDB).map((item, index) => (
                  <div key={index} className="bg-green-400 text-white p-2 rounded-md flex-1 text-center">
                    {item.nic} - {item.nic} successfully saved
                  </div>
                ))}

              </div>
            </div>
          )}
        </div>
      )}

      {nicList.length > 0 && (
        <div className="w-100 mx-4">
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
function String(val: unknown): string {
  return val !== null && val !== undefined ? val.toString() : "";
}
