"use client";

    import Link from 'next/link';
    import { Button } from '@/components/ui/button';
    import { cn } from '@/lib/utils';
    import {
      Tooltip,
      TooltipContent,
      TooltipTrigger,
			TooltipProvider
    } from '@/components/ui/tooltip';
    import { Github } from 'lucide-react';
    import { useSettings } from '@/components/settings-provider';

    export function MainFooter() {
      const { accentColor, fontSize } = useSettings();
      return (
        <footer className="border-t py-8 text-center text-muted-foreground w-full" style={{ backgroundColor: accentColor, fontSize: `${fontSize / 16 * 0.875}rem` }}>
          <div className="container flex flex-col items-center justify-center space-y-4 mx-auto">
            <p className="text-sm text-foreground" style={{ fontSize: `${fontSize / 16 * 0.875}rem` }}>
              <b>NicValidator</b> is a <u>free</u> tool designed to <u>simplify</u> your life!
            </p>
            <Button asChild variant="outline" style={{ fontSize: `${fontSize / 16 * 0.875}rem` }}>
              <Link href="/web/donate">Donate to Support Our Mission</Link>
            </Button>
            <div className="flex space-x-4">
							<TooltipProvider>
								<Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                    <Link href="https://github.com/DeegayuA/NicValidation">
											{/* <p className="text-sm">Github</p> */}
                     	<Github size={20} strokeWidth={2} absoluteStrokeWidth />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center">
                    GitHub
                  </TooltipContent>
                </Tooltip>
							</TooltipProvider>
            </div>
            <div className="flex space-x-4">
            {/* <Link href="/web/help" className="text-xs text-foreground hover:underline" style={{ fontSize: `${fontSize / 16 * 0.75}rem` }}>Help Center</Link> 
             <Link href="/web/sitemap" className="text-xs text-foreground hover:underline" style={{ fontSize: `${fontSize / 16 * 0.75}rem` }}>Sitemap</Link> 
              <Link href="/web/terms" className="text-xs text-foreground hover:underline" style={{ fontSize: `${fontSize / 16 * 0.75}rem` }}>Terms of Service</Link>
              <Link href="/web/privacy" className="text-xs text-foreground hover:underline" style={{ fontSize: `${fontSize / 16 * 0.75}rem` }}>Privacy Policy</Link> */}
            </div>
            <p className="text-xs text-foreground" style={{ fontSize: `${fontSize / 16 * 0.75}rem` }}>
              © {new Date().getFullYear()} NicValidator. All rights reserved.
            </p>
          </div>
        </footer>
      );
    }
