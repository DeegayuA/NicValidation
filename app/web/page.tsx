'use client'

import { Playfair_Display } from "next/font/google";
import { useSettings } from "@/components/settings-provider";
import React, { useEffect, useState } from "react";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import { cn } from "@/lib/utils";
import { PlaceholdersAndVanishInputDemo } from "@/components/vanishing_text";
import { useRouter } from 'next/navigation'; 
import { GlobeDemo } from "./globe-component";
import { FileUpload } from "@/components/ui/file-upload";

const playfairDisplay = Playfair_Display({ subsets: ['latin'] });

export default function Home() {
  const { reducedMotion, fontSize, accentColor, highContrast, lineHeight, letterSpacing } = useSettings();
  const [loading, setLoading] = useState(true);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const router = useRouter(); 

  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };

  return (
    <div
      style={{
        fontSize: `${fontSize / 16}rem`,
      }}
    >
      <section
        className="rounded-lg relative h-[60vh] flex items-center justify-center overflow-hidden mx-auto z-20 max-w-[1280px] mt-[5rem]"
        aria-labelledby="hero-heading"
      >

        <div className="absolute inset-0">
        < GlobeDemo />
        {/* <img
            src="https://pub-f3746e8bbc624ef5a6987eac05efe3f7.r2.dev/hero.jpg"
            alt="Immersive Background"
            className={cn(
              "object-cover w-full h-full opacity-40 brightness-60 contrast-10 z-0",
              highContrast && "brightness-40 contrast-150 border-2 border-white antialiased"
            )}
          /> */}
          {/* <div className="absolute inset-0 bg-black/40"></div> */}
          
        </div>
       <div className="relative z-20">
       <PlaceholdersAndVanishInputDemo />
       <FileUpload onChange={handleFileUpload} />
       </div>

      </section>

    </div>
  );
}
