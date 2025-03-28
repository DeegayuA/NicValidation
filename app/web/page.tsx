'use client';

import { useSettings } from "@/components/settings-provider";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { GlobeDemo } from "./globe-component";
import { PlaceholdersAndVanishInputDemo } from "@/components/vanishing_text";
import BulkValidatorPage from "./bulk-val";

interface BulkValidatorPageProps {
  files: File[]; // Add the files property
  onFilesChange: (hasFiles: boolean) => void;
}

export default function Home() {
  const { fontSize = 16 } = useSettings();
  const [files, setFiles] = useState<File[]>([]);
  const [hasFilesInBulkValidator, setHasFilesInBulkValidator] = useState(false); // Track if files are in BulkValidatorPage
  const router = useRouter();

  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles(uploadedFiles);
    sessionStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
  };

  const handleSubmit = async () => {
    if (files.length > 0) {
      const formData = new FormData();
      files.forEach((file) => formData.append("file", file));

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
          sessionStorage.setItem('uploadedFiles', JSON.stringify(files));
          router.push('/web/bulkvalidator');
        } else {
          alert("Upload failed: " + data.error);
        }
      } catch (error) {
        console.error("Upload error: ", error);
      }
    }
  };

  const handleFilesInBulkValidator = (hasFiles: boolean) => {
    setHasFilesInBulkValidator(hasFiles);
  };

  return (
    <div style={{ fontSize: `${fontSize / 16}rem` }}>
      <section className="rounded-lg relative min-h-[60vh] flex items-center justify-center overflow-hidden mx-auto z-20 max-w-[1280px] mt-[5rem]" aria-labelledby="hero-heading">
        <div className="absolute inset-0">
          <GlobeDemo />
        </div>
        <div className="relative z-20 text-center w-auto">
          {/* Hide the vanishing input if files exist in BulkValidatorPage */}
          {!hasFilesInBulkValidator && <PlaceholdersAndVanishInputDemo />}

          <BulkValidatorPage
            onFilesChange={handleFilesInBulkValidator}
          />
        </div>
      </section>
    </div>
  );
}