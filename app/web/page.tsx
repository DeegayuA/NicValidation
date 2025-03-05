'use client'

import { Playfair_Display } from "next/font/google";
import { useSettings } from "@/components/settings-provider";
import React, { useEffect, useState } from "react";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import { BackgroundLines } from "@/components/ui/background-lines";
import { cn } from "@/lib/utils";
import { PlaceholdersAndVanishInputDemo } from "@/components/vanishing_text";
import { FeaturesSectionDemo } from "@/components/ui/bento";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { useRouter } from 'next/navigation'; // Import useRouter
import { GlobeDemo } from "./globe-component";

const playfairDisplay = Playfair_Display({ subsets: ['latin'] });

// const loadingStates = [
//   {
//     text: "Verifying NIC format...",
//   },
//   {
//     text: "Extracting details from NIC...",
//   },
//   {
//     text: "Cross-checking validity...",
//   },
//   {
//     text: "Ensuring accuracy and security...",
//   },
// ];

const loadingStates = [
  {
    text: "Loading Started...",
  },
  {
    text: "Initializing NIC validation engine...",
  },
  {
    text: "Verifying security protocols...",
  },
  {
    text: "Loading national identification data formats...",
  },
  {
    text: "Starting AI connections...",
  },
  {
    text: "Done! System is ready...",
  },
];

export default function Home() {
  const { reducedMotion, fontSize, accentColor, highContrast, lineHeight, letterSpacing } = useSettings();
  const [loading, setLoading] = useState(true);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      clearTimeout(loadingTimeout);
    };
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    const inputValue = (event.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
    localStorage.setItem('userInput', inputValue); // Store the input value
    router.push('/web/app'); // Navigate to the app page
  };

  return (
    <div
      className="min-h-screen p-4 sm:p-6"
      style={{
        fontSize: `${fontSize / 16}rem`,
      }}
    >
      {!reducedMotion && (
        <Loader loadingStates={loadingStates} loading={loading} duration={500} />
      )}
      <section
        className="rounded-lg relative h-[70vh] flex items-center justify-center overflow-hidden mx-auto z-20 max-w-[1280px] mt-[5rem]"
        aria-labelledby="hero-heading"
      >

        <div className="absolute inset-0">
        < GlobeDemo />
        <img
            src="https://pub-f3746e8bbc624ef5a6987eac05efe3f7.r2.dev/hero.jpg"
            alt="Immersive Background"
            className={cn(
              "object-cover w-full h-full opacity-40 brightness-60 contrast-10 z-0",
              highContrast && "brightness-40 contrast-150 border-2 border-white antialiased"
            )}
          />
          {/* <div className="absolute inset-0 bg-black/40"></div> */}
          
        </div>
        <PlaceholdersAndVanishInputDemo />

      </section>

      <div className="relative z-20 py-8 lg:py-5 max-w-7xl mx-auto">
        <div className="px-8">
          <h4 className={cn("text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white", playfairDisplay.className)} style={{ fontSize: `${fontSize / 16 * 1.875}rem`, lineHeight, letterSpacing: `${letterSpacing}px` }}>
            Experience Innovation, Designed for Everyone
          </h4>

          <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300" style={{ fontSize: `${fontSize / 16 * 0.875}rem`, lineHeight, letterSpacing: `${letterSpacing}px` }}>
            Unlock seamless accessibility with NicValidator's intelligent features <br />- built to adapt, enhance, and empower individuals of all abilities.
          </p>
        </div>
      </div>

    </div>
  );
}
