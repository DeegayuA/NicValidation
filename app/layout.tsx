'use client'
import './globals.css';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Josefin_Sans } from 'next/font/google';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SettingsProvider } from "@/components/settings-provider";
import { LanguageProvider } from "@/components/language-provider";
import { TooltipProvider } from "@/components/ui/tooltip"; // Import TooltipProvider
import TransitionWrapper from '@/components/TransitionWrapper';
import { useState } from 'react';
import { MainNavbar } from '@/components/main-navbar';
import { MainFooter } from '@/components/main-footer';
import { Toaster } from 'sonner';
import { LayoutWrapper } from '@/components/layout-wrapper';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';

// Lazy load ThemeProvider
const ThemeProvider = dynamic(() => import('@/components/theme-provider').then((mod) => mod.ThemeProvider), { 
  ssr: false  // Disable server-side rendering to load only on the client side
});

const inter = Inter({ subsets: ['latin'] });
const josefinSans = Josefin_Sans({ subsets: ['latin'] });

export default function RootLayout({ children }: { readonly children: React.ReactNode; }) {
    const [loading, setLoading] = useState(false);
    const { resolvedTheme } = useTheme();
    const pathname = usePathname();
    
    const isDashboard = pathname === '/dashboard'; 
    
    return (
        <html lang="en" suppressHydrationWarning className="h-full">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                <meta name="description" content="NicValidator" />
                <meta name="title" content="NicValidator" />
                <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>👓</text></svg>" sizes="any" />
                <link rel="preload" href="/_next/static/media/a34f9d1faa5f3315-s.p.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
                <link rel="preload" href="/_next/static/css/app/layout.css?v=1737186472472" as="style" />
            </head>
            <body className={cn(inter.className, 'h-full min-h-screen')}>
                <SpeedInsights />
                <Analytics />
                <SessionProvider>
                <TransitionWrapper setLoading={setLoading}>
                    <SettingsProvider>
                        <LayoutWrapper>
                            <TooltipProvider> 
                                <ThemeProvider>
                                    <LanguageProvider>
                                        {!isDashboard && <MainNavbar />} 
                                        <div style={{ color: resolvedTheme === 'dark' ? 'black' : 'white' }}>
                                            <div id='web' className="flex-1">
                                                {children}
                                            </div>
                                        </div>
                                        {!isDashboard && <MainFooter />} 
                                        <Toaster />
                                    </LanguageProvider>
                                </ThemeProvider>
                            </TooltipProvider>
                        </LayoutWrapper>
                    </SettingsProvider>
                </TransitionWrapper>
                </SessionProvider>
            </body>
        </html>
    );
}