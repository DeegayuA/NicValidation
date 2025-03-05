"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import chroma from "chroma-js";
import { useSettings } from '@/components/settings-provider';

function darkenAccentColor(color: string | number | { [key: string]: number; } | chroma.Color) {
    return chroma(color).darken(1).hex();
}

function lightenAccentColor(color: string | number | { [key: string]: number; } | chroma.Color) {
    return chroma(color).brighten(1).hex();
}

export function GlobeDemo() {
    const { accentColor, theme, fontSize } = useSettings();
    const [globeKey, setGlobeKey] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const polygonColor = useSettings().theme === "dark"
        ? "rgba(255, 255, 255, 0.3)"  // darker for dark mode
        : "rgba(255, 255, 255, 0.7)"; // lighter for light mode

    const globeConfig = {
        pointSize: 4,
        globeColor: darkenAccentColor(accentColor),
        showAtmosphere: true,
        atmosphereColor: lightenAccentColor(accentColor),
        atmosphereAltitude: 0.2,
        emissive: darkenAccentColor(accentColor),
        emissiveIntensity: 0.1,
        shininess: 0.9,
        polygonColor: polygonColor,
        ambientLight: lightenAccentColor(accentColor),
        directionalLeftLight: "#ffffff",
        directionalTopLight: "#ffffff",
        pointLight: "#ffffff",
        arcTime: 1000,
        arcLength: 0.9,
        rings: 1,
        maxRings: 3,
        initialPosition: { lat: -6.9271, lng: 79.8612 }, // Sri Lanka
        autoRotate: true,
        autoRotateSpeed: 0.9,
    };

    useEffect(() => {
        setIsClient(true);
    }, [])

    useEffect(() => {
        setGlobeKey(prevKey => prevKey + 1);
    }, [accentColor]);

    const colors = [accentColor, lightenAccentColor(accentColor), darkenAccentColor(accentColor)];


    const sampleArcs = [
        {
            order: 1,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: -22.9068,
            endLng: -43.1729,
            arcAlt: 0.1,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 1,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 3.139,
            endLng: 101.6869,
            arcAlt: 0.2,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 1,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: -1.303396,
            endLng: 36.852443,
            arcAlt: 0.5,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 2,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 35.6762,
            endLng: 139.6503,
            arcAlt: 0.2,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 2,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 3.139,
            endLng: 101.6869,
            arcAlt: 0.3,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 2,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: -15.785493,
            endLng: -47.909029,
            arcAlt: 0.3,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 3,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 22.3193,
            endLng: 114.1694,
            arcAlt: 0.3,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 3,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 40.7128,
            endLng: -74.006,
            arcAlt: 0.3,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 3,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 51.5072,
            endLng: -0.1276,
            arcAlt: 0.3,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 4,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: -15.595412,
            endLng: -56.05918,
            arcAlt: 0.5,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 4,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 22.3193,
            endLng: 114.1694,
            arcAlt: 0.7,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 4,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 48.8566,
            endLng: 2.3522,
            arcAlt: 0.1,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 5,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 51.5072,
            endLng: -0.1276,
            arcAlt: 0.3,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 5,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: -33.8688,
            endLng: 151.2093,
            arcAlt: 0.2,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 5,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 48.8566,
            endLng: 2.3522,
            arcAlt: 0.2,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 6,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 1.094136,
            endLng: -63.34546,
            arcAlt: 0.7,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 6,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 35.6762,
            endLng: 139.6503,
            arcAlt: 0.1,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 6,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 51.5072,
            endLng: -0.1276,
            arcAlt: 0.3,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 7,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: -15.595412,
            endLng: -56.05918,
            arcAlt: 0.1,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 7,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 52.52,
            endLng: 13.405,
            arcAlt: 0.1,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 7,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 34.0522,
            endLng: -118.2437,
            arcAlt: 0.2,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 8,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: -33.936138,
            endLng: 18.436529,
            arcAlt: 0.2,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 8,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 52.3676,
            endLng: 4.9041,
            arcAlt: 0.2,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 8,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 40.7128,
            endLng: -74.006,
            arcAlt: 0.5,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 9,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 34.0522,
            endLng: -118.2437,
            arcAlt: 0.2,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 9,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: -22.9068,
            endLng: -43.1729,
            arcAlt: 0.7,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 9,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: -34.6037,
            endLng: -58.3816,
            arcAlt: 0.5,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 10,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 28.6139,
            endLng: 77.209,
            arcAlt: 0.7,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 10,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 31.2304,
            endLng: 121.4737,
            arcAlt: 0.3,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 10,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 52.3676,
            endLng: 4.9041,
            arcAlt: 0.3,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },

        {
            order: 11,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 19.0760,
            endLng: 72.8777,
            arcAlt: 0.5,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 11,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 39.9042,
            endLng: 116.4074,
            arcAlt: 0.6,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 11,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: -12.0464,
            endLng: -77.0428,
            arcAlt: 0.5,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 12,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 48.8566,
            endLng: 2.3522,
            arcAlt: 0.7,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 12,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 55.7558,
            endLng: 37.6173,
            arcAlt: 0.6,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 12,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 40.7306,
            endLng: -73.9352,
            arcAlt: 0.4,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 13,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 34.0522,
            endLng: -118.2437,
            arcAlt: 0.2,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 13,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 41.9028,
            endLng: 12.4964,
            arcAlt: 0.5,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 13,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 43.6532,
            endLng: -79.3832,
            arcAlt: 0.3,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 14,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 19.4326,
            endLng: -99.1332,
            arcAlt: 0.4,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 14,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 38.7169,
            endLng: 9.6457,
            arcAlt: 0.5,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 14,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 35.6762,
            endLng: 139.6503,
            arcAlt: 0.6,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 15,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 4.7105,
            endLng: -74.0731,
            arcAlt: 0.3,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 15,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: -33.8688,
            endLng: 151.2093,
            arcAlt: 0.7,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 15,
            startLat: 6.9271,
            startLng: 79.8612,
            endLat: 55.9533,
            endLng: -3.1883,
            arcAlt: 0.5,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        
        {
            order: 1,
            startLat: 19.0760,
            startLng: 72.8777,
            endLat: 6.9271,
            endLng: 79.8612,
            arcAlt: 0.5,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 2,
            startLat: 39.9042,
            startLng: 116.4074,
            endLat: 6.9271,
            endLng: 79.8612,
            arcAlt: 0.6,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 3,
            startLat: -12.0464,
            startLng: -77.0428,
            endLat: 6.9271,
            endLng: 79.8612,
            arcAlt: 0.5,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 4,
            startLat: 48.8566,
            startLng: 2.3522,
            endLat: 6.9271,
            endLng: 79.8612,
            arcAlt: 0.7,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 5,
            startLat: 55.7558,
            startLng: 37.6173,
            endLat: 6.9271,
            endLng: 79.8612,
            arcAlt: 0.6,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 6,
            startLat: 40.7306,
            startLng: -73.9352,
            endLat: 6.9271,
            endLng: 79.8612,
            arcAlt: 0.4,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 7,
            startLat: 34.0522,
            startLng: -118.2437,
            endLat: 6.9271,
            endLng: 79.8612,
            arcAlt: 0.2,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 8,
            startLat: 41.9028,
            startLng: 12.4964,
            endLat: 6.9271,
            endLng: 79.8612,
            arcAlt: 0.5,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 9,
            startLat: 43.6532,
            startLng: -79.3832,
            endLat: 6.9271,
            endLng: 79.8612,
            arcAlt: 0.3,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 10,
            startLat: 19.4326,
            startLng: -99.1332,
            endLat: 6.9271,
            endLng: 79.8612,
            arcAlt: 0.4,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 11,
            startLat: 38.7169,
            startLng: 9.6457,
            endLat: 6.9271,
            endLng: 79.8612,
            arcAlt: 0.5,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 12,
            startLat: 35.6762,
            startLng: 139.6503,
            endLat: 6.9271,
            endLng: 79.8612,
            arcAlt: 0.6,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 13,
            startLat: 4.7105,
            startLng: -74.0731,
            endLat: 6.9271,
            endLng: 79.8612,
            arcAlt: 0.3,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 14,
            startLat: -33.8688,
            startLng: 151.2093,
            endLat: 6.9271,
            endLng: 79.8612,
            arcAlt: 0.7,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 15,
            startLat: 55.9533,
            startLng: -3.1883,
            endLat: 6.9271,
            endLng: 79.8612,
            arcAlt: 0.5,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        }
    ];

    const World = isClient ? dynamic(() => import("../../components/ui/globe").then((m) => m.World), {
        ssr: false,
        loading: () => <p>Loading...</p>
    }) : null;

    return (
<div className="flex flex-row items-center justify-center h-screen md:h-auto dark:bg-black bg-white relative w-full">
<div className="max-w-7xl mx-auto w-full relative overflow-hidden h-full md:h-[40rem] px-4">
                {/* <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 1,
                    }}
                    className="div"
                >
                    <h2 className="text-center font-bold text-black dark:text-white" style={{ fontSize: `${fontSize / 16 *3}rem` }}>
                        Help us
                    </h2>
                    <p className="text-center text-base font-normal text-neutral-700 dark:text-neutral-200 max-w-md mt-2 mx-auto" style={{ fontSize: `${fontSize / 16}rem` }}>
                        to help the world, to see through the eyes of the visually impaired.
                    </p>
                </motion.div> */}
                <div className="absolute w-full bottom-0 inset-x-0 h-40 bg-gradient-to-b pointer-events-none select-none from-transparent dark:to-black to-white z-20" />
                <div className="absolute w-full bottom-10 h-32 md:h-full z-10">
                    {World && <World data={sampleArcs} globeConfig={globeConfig} />}
                </div>
            </div>
        </div>
    );
}
