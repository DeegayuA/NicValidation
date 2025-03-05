"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { useSpring } from "@react-spring/web";
import { motion } from "framer-motion";
import { IconBrandYoutubeFilled } from "@tabler/icons-react";
import Link from "next/link";
import { Playfair_Display } from 'next/font/google';
import { useSettings } from '@/components/settings-provider';

const playfairDisplay = Playfair_Display({ subsets: ['latin'] });

export function FeaturesSectionDemo() {
    const { reducedMotion, fontSize, accentColor, highContrast, lineHeight, letterSpacing } = useSettings();
    const features = [
        {
            title: "Seamless Navigation and Issue Management",
            description:
                "Manage day-to-day activities and accessibility challenges with an intuitive, user-friendly interface tailored to diverse needs.",
            skeleton: <SkeletonTwo />,
            className: "border-b col-span-1 lg:col-span-3 dark:border-neutral-700 lg:border-r",
        },
        {
            title: "AI-Powered Object Recognition",
            description:
                "Leverage advanced AI and OCR technology to identify objects, extract text, and provide real-time contextual guidance.",
            skeleton: <SkeletonOne />,
            className:
                "col-span-1 lg:col-span-5 border-b dark:border-neutral-700",
        },
        {
            title: "Interactive Tutorials and Resources",
            description:
                "Explore in-depth video tutorials and resources about LifeSight on platforms like YouTube to maximize your experience.",
            skeleton: <SkeletonThree />,
            className:
                "col-span-1 lg:col-span-5 lg:border-r sm:border-b dark:border-neutral-700 md:border-b-0"
        },
        {
            title: "Rapid and Scalable Deployment",
            description:
                "Our solution is designed for quick and scalable deployment, ensuring accessibility for users across the globe.",
            skeleton: <SkeletonFour />,
            className: "col-span-1 lg:col-span-3 lg:border-none dark:border-neutral-700",
        },
    ];
    return (
        <div className="relative z-20 py-8 lg:py-5 max-w-7xl mx-auto">
            <div className="px-8">
                <h4 className={cn("text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white", playfairDisplay.className)} style={{ fontSize: `${fontSize / 16 * 1.875}rem`, lineHeight, letterSpacing: `${letterSpacing}px` }}>
                    Packed with Accessibility-Driven Features
                </h4>

                <p className="text-sm lg:text-base  max-w-2xl  my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300" style={{ fontSize: `${fontSize / 16 * 0.875}rem`, lineHeight, letterSpacing: `${letterSpacing}px` }}>
                    Discover how LifeSight is redefining accessibility through innovative, user-centric features designed to empower differently-abled individuals.
                </p>
            </div>

            <div className="relative ">
                <div className="grid grid-cols-1 lg:grid-cols-8 mt-12 xl:border rounded-md dark:border-neutral-700">
                    {features.map((feature) => (
                        <FeatureCard key={feature.title} className={feature.className}>
                            <FeatureTitle style={{ fontSize: `${fontSize / 16 * 1.25}rem`, lineHeight, letterSpacing: `${letterSpacing}px` }}>{feature.title}</FeatureTitle>
                            <FeatureDescription style={{ fontSize: `${fontSize / 16 * 0.875}rem`, lineHeight, letterSpacing: `${letterSpacing}px` }}>{feature.description}</FeatureDescription>
                            <div className=" h-full w-full">{feature.skeleton}</div>
                        </FeatureCard>
                    ))}
                </div>
            </div>
        </div>
    );
}

const FeatureCard = ({
    children,
    className,
}: {
    children?: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>
            {children}
        </div>
    );
};

const FeatureTitle = ({ children, style }: { children?: React.ReactNode, style?: React.CSSProperties }) => {
    return (
        <p className=" max-w-5xl mx-auto text-left tracking-tight text-black dark:text-white text-xl md:text-2xl md:leading-snug" style={style}>
            {children}
        </p>
    );
};

const FeatureDescription = ({ children, style }: { children?: React.ReactNode, style?: React.CSSProperties }) => {
    return (
        <p
            className={cn(
                "text-sm md:text-base  max-w-4xl text-left mx-auto",
                "text-neutral-500 text-center font-normal dark:text-neutral-300",
                "text-left max-w-sm mx-0 md:text-sm my-2"
            )}
            style={style}
        >
            {children}
        </p>
    );
};

export const SkeletonOne = () => {
    const { reducedMotion, fontSize, accentColor, highContrast, lineHeight, letterSpacing } = useSettings();
    return (
        <div className="relative flex py-2 px-2 gap-10 h-full">
            <div className="w-full mx-auto bg-white dark:bg-neutral-900 shadow-2xl group h-full">
                <div className="flex flex-1 w-full h-full flex-col space-y-2  ">
                    {/* TODO */}
                    <Image
                        src="https://i0.wp.com/www.thestartupfounder.com/wp-content/uploads/2022/12/Object_Detection_RoomDetected.jpg?fit=1024%2C683&ssl=1"
                        alt="header"
                        width={200}
                        height={200}
                        className="h-full w-full aspect-auto object-cover object-center rounded-sm"
                    />
                </div>
            </div>

            <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-white dark:from-black via-white dark:via-black to-transparent w-full pointer-events-none" />
            <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-white dark:from-black via-transparent to-transparent w-full pointer-events-none" />
        </div>
    );
};

export const SkeletonThree = () => {
    const { reducedMotion, fontSize, accentColor, highContrast, lineHeight, letterSpacing } = useSettings();
    return (
        <Link
            href="https://www.youtube.com/watch?v=e2nkq3h1P68"
            target="__blank"
            className="relative flex gap-10 h-full group/image"
        >
            <div className="w-full  mx-auto bg-transparent dark:bg-transparent group h-full">
                <div className="flex flex-1 w-full h-full flex-col space-y-2  relative">
                    {/* TODO */}
                    <IconBrandYoutubeFilled className="h-20 w-20 absolute z-10 inset-0 text-red-500 m-auto " />
                    <Image
                        src="https://img.uxcel.com/tags/accessibility-1689755278465-2x.jpg"
                        alt="header"
                        width={400}
                        height={400}
                        className={cn(
                            "h-full w-full aspect-video object-cover object-center rounded-sm transition-all duration-500",
                            reducedMotion ? "transition-none blur-none group-hover/image:blur-none" : "group-hover/image:blur-md"
                        )}
                    />
                </div>
            </div>
        </Link>
    );
};

export const SkeletonTwo = () => {
    const { reducedMotion, fontSize, accentColor, highContrast, lineHeight, letterSpacing } = useSettings();
    const images = [
        "https://www.marthastewart.com/thmb/lxfu2-95SWCS0jwciHs1mkbsGUM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/modern-living-rooms-wb-1-bc45b0dc70e541f0ba40364ae6bd8421.jpg",
        "https://i.pinimg.com/1200x/be/05/0e/be050ebf28b6c615559bd28a70c96f0a.jpg",
        "https://hips.hearstapps.com/hmg-prod/images/bcacfded-198f-4492-899c-da0e4457a247.jpg?crop=1xw:1xh;center,top&resize=980:*",
        "https://media.timeout.com/images/106106352/750/562/image.jpg",
        "https://media.wired.com/photos/5bce6ca10fc6cf6fff0a00d1/master/pass/Amazon-Go-FINAL.jpg",
    ];

    const imageVariants = {
        whileHover: {
            scale: 1.3,
            rotate: 0,
            zIndex: 100,
        },
        whileTap: {
            scale: 1.3,
            rotate: 0,
            zIndex: 100,
        },
    };
    return (
        <div className="relative flex flex-col items-start p-8 gap-4 h-full overflow-hidden">
            {/* TODO */}
            <div className="flex flex-row lg:-ml-[25rem] -ml-20">
                {images.map((image, idx) => (
                    <motion.div
                        variants={imageVariants}
                        key={"images-first" + idx}
                        style={{
                            rotate: Math.random() * 25 - 10,
                        }}
                        whileHover={reducedMotion ? undefined : "whileHover"}
                        whileTap={reducedMotion ? undefined : "whileTap"}
                        className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
                    >
                        <Image
                            src={image}
                            alt="bali images"
                            width="500"
                            height="500"
                            className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
                        />
                    </motion.div>
                ))}
            </div>
            <div className="flex flex-row">
                {images.map((image, idx) => (
                    <motion.div
                        key={"images-second" + (idx + 2)}
                        style={{
                            rotate: Math.random() * 30 - 10,
                        }}
                        variants={imageVariants}
                        whileHover={reducedMotion ? undefined : "whileHover"}
                        whileTap={reducedMotion ? undefined : "whileTap"}
                        className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
                    >
                        <Image
                            src={image}
                            alt="Image description"
                            width="500"
                            height="500"
                            className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
                        />
                    </motion.div>
                ))}
            </div>

            <div className="absolute left-0 z-[100] inset-y-0 w-20 bg-gradient-to-r from-white dark:from-black to-transparent  h-full pointer-events-none" />
            <div className="absolute right-0 z-[100] inset-y-0 w-20 bg-gradient-to-l from-white dark:from-black  to-transparent h-full pointer-events-none" />
        </div>
    );
};

export const SkeletonFour = () => {
    const { reducedMotion, fontSize, accentColor, highContrast, lineHeight, letterSpacing } = useSettings();
    return (
        <div className="h-80 md:h-100 flex flex-col items-center relative bg-transparent dark:bg-transparent mt-10 w-full h-full">
            <Globe className="absolute -right-[8rem] md:-right-[15rem]  -bottom-[10em] md:-bottom-[8rem]" reducedMotion={reducedMotion} />
        </div>
    );
};

const hexToRgbArray = (hex: string | undefined): [number, number, number] => {
    if (typeof hex !== 'string' || !/^#?[0-9A-Fa-f]{6}$/.test(hex)) {
        console.warn('Invalid HEX color provided:', hex);
        return [0, 0, 0]; // Return black as a fallback
    }

    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    return [r, g, b];
};



export const Globe = ({ className }: { className?: string, reducedMotion?: boolean }) => {
    const { reducedMotion, accentColor } = useSettings();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointerInteracting = useRef<number | null>(null);
    const pointerInteractionMovement = useRef<number>(0);

    const [{ r }, api] = useSpring(() => ({
        r: 0,
        config: {
            mass: 1,
            tension: 280,
            friction: 60,
            precision: 0.001,
        },
    }));

    useEffect(() => {
        let phi = 15.5;
        let width = 0;
        const isSmallDevice = window.innerWidth <= 768;
        let globe: any = null; // To store the globe instance

        const onResize = () => {
            if (canvasRef.current) {
                width = canvasRef.current.offsetWidth;
                // Recreate the globe with the updated size
                if (globe) globe.destroy();
                globe = createGlobe(canvasRef.current!, {
                    devicePixelRatio: 2,
                    width: width * 2,
                    height: width * 2,
                    phi: 15.5,
                    theta: 0.2,
                    dark: document.documentElement?.style.colorScheme === 'dark' ? 1 : 0,
                    diffuse: 4,
                    mapSamples: isSmallDevice ? 16000 : 64000,
                    mapBrightness: document.documentElement?.style.colorScheme === 'dark' ? 10 : 1,
                    baseColor: document.documentElement?.style.colorScheme === 'dark' ? hexToRgbArray(accentColor) : [0.5, 0.5, 0.5],
                    markerColor: accentColor ? hexToRgbArray(accentColor) : [1, 0.4, 0],
                    glowColor: document.documentElement?.style.colorScheme === 'dark' ? [0.2, 0.2, 0.2] : [0.5, 0.5, 0.5],
                    markers: [
                        { location: [40.7128, -74.006], size: 0.05 }, // New York
                        { location: [51.5074, -0.1278], size: 0.05 }, // London
                        { location: [-33.8688, 151.2093], size: 0.05 }, // Sydney
                        { location: [19.076, 72.8777], size: 0.05 }, // Mumbai
                        { location: [39.9042, 116.4074], size: 0.05 }, // Beijing
                        { location: [6.9271, 79.8612], size: 0.1 }, // Colombo
                    ],
                    onRender: (state) => {
                        state.phi = phi + r.get();
                        if (!reducedMotion) {
                            phi += 0.0005;
                        }
                    },
                });
            }
        };

        // Initial resize call
        onResize();
        window.addEventListener('resize', onResize);

        return () => {
            if (globe) globe.destroy();
            window.removeEventListener('resize', onResize);
        };
    }, [r, reducedMotion, accentColor]);

    const handlePointerDown = (event: React.PointerEvent) => {
        pointerInteracting.current = event.clientX;
        api.stop();
    };

    const handlePointerMove = (event: React.PointerEvent) => {
        if (pointerInteracting.current !== null) {
            const delta = event.clientX - pointerInteracting.current;
            pointerInteracting.current = event.clientX;
            pointerInteractionMovement.current += delta;
            api.start({ r: pointerInteractionMovement.current / 200 });
        }
    };

    const handlePointerUp = () => {
        pointerInteracting.current = null;
        api.start({ r: 0 });
    };

    const width = window.innerWidth <= 564 ? '100%' : window.innerWidth <= 768 ? '100%' : window.innerWidth <= 1024 ? '10%' : '170%';

    return (
        <canvas
            ref={canvasRef}
            style={{
                width: width,
                height: 'auto',
                aspectRatio: 1,
                cursor: 'grab',
            }}
            className={className}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
        />
    );
};
