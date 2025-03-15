"use client";
import React, { JSX, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ACCENT_COLORS, APP_VERSION } from "@/lib/constants";
import { useSettings } from "../settings-provider";
import { useTheme } from "next-themes";
import { UserCog, User } from 'lucide-react';
import { useRouter } from "next/navigation";
import { HoverBorderGradient } from "./hover-border-gradient";
import chroma from 'chroma-js';


// Helper functions to adjust the color
function darkenAccentColor(color: string) {
    return chroma(color).darken(1).hex(); // Darken the color by 1
}

function lightenAccentColor(color: string) {
    return chroma(color).brighten(1).hex(); // Lighten the color by 1
}

export const FloatingNav = ({
    navItems,
    className,
}: {
    navItems: {
        divider?: any;
        name: string;
        link?: string;
        onClick?: () => void;
        icon?: JSX.Element;
        tooltip?: string; 
        hideOnMd?: boolean; 
    }[];
    className?: string;
}) => {
    const {
        accentColor,
        fontSize,
        setAccentColor,
    } = useSettings();
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { setTheme, theme } = useTheme();
    const router = useRouter()

    const dynamicFontSize = `${(fontSize / 16) * 1}rem`;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                className={cn(
                    "flex max-w-fit fixed top-4 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-black bg-white shadow-lg z-[5000] pr-1 pl-1 md:pr-2 md:pl-2 lg:pl-4 py-1 items-center justify-center",
                    className
                )}
                style={{
                    background: `linear-gradient(to right, ${accentColor}, ${document.documentElement.classList.contains('dark')
                        ? darkenAccentColor(accentColor) 
                        : lightenAccentColor(accentColor)
                        })`,
                }}
            >
                <Link href="/" className="flex space-x-1 md:space-x-2 items-center">
                    {/* <span className="text-2xl hidden sm:inline py-2">👓</span> */}
                    <span
                        className="font-bold text-xl hidden sm:inline py-2 pl-2"
                        style={{ fontSize: dynamicFontSize }}
                    >
                        {APP_VERSION}
                    </span>
                </Link>

                {navItems.map((navItem, idx) => (
                    <div key={`nav-item-${idx}`} className={navItem.hideOnMd ? "sm:hidden" : ""}>
                        {navItem.divider ? (
                            <span
                                className="px-0 !important flex items-center justify-center text-muted-foreground"
                            >
                                {navItem.icon}
                            </span>
                        ) : (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    {navItem.link ? (
                                        <Link
                                            key={`nav-item-${idx}`}
                                            href={navItem.link}
                                            className={cn(
                                                "relative items-center flex space-x-0 px-1 md:px-2 lg:px-4 py-2",
                                                "bg-transparent text-foreground hover:filter hover:brightness-110 hover:hue-rotate-10 hover:bg-muted/10 hover:text-accent-foreground",
                                                navItem.hideOnMd && "md:hidden"
                                            )}
                                        >
                                            <span className="block sm:hidden">{navItem.icon}</span>
                                            <span className="hidden sm:block">{navItem.name}</span>
                                        </Link>
                                    ) : (
                                        <button
                                            key={`nav-item-${idx}`}
                                            onClick={navItem.onClick}
                                            className={cn(
                                                "relative items-center flex space-x-0 px-1 md:px-2 lg:px-4 py-2",
                                                "bg-transparent text-foreground hover:filter hover:brightness-110 hover:hue-rotate-10 hover:bg-muted/10 hover:text-accent-foreground",
                                                navItem.hideOnMd && "md:hidden"
                                            )}
                                        >
                                            <span className="block sm:hidden">{navItem.icon}</span>
                                            <span className="hidden sm:block">{navItem.name}</span>
                                        </button>
                                    )}
                                </TooltipTrigger>
                                <TooltipContent side="top" align="center" className="md:block">
                                    {navItem.tooltip || navItem.name}
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                ))}

                

                <div className="pr-1 md:pr-2 lg:pr-4 "></div>
                <HoverBorderGradient
                    className="text-black dark:text-white flex items-center"
                    as="button"
                    onClick={() => router.push('/login')}
                    style={{ backgroundColor: accentColor }} 
                >
                    {/* Show text on larger screens */}
                    <span className="flex items-center">
                        <span className="hidden sm:inline">Login</span>
                        <span className="sm:hidden">
                            <UserCog className="h-3 w-3 sm:h-5 sm:w-5 text-black dark:text-white" />
                        </span>
                    </span>
                </HoverBorderGradient>

            </motion.div>
        </AnimatePresence>
    );
};
