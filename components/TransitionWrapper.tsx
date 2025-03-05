'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TransitionWrapperProps {
  children: React.ReactNode;
  setLoading: (loading: boolean) => void;
}

export default function TransitionWrapper({ children, setLoading }: TransitionWrapperProps) {
  const pathname = usePathname();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isExternalNavigation, setIsExternalNavigation] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(0); // Add loadingIndex state

  const loadingStates = [
    {
      text: "Enhancing accessibility features...",
    },
    {
      text: "Researching visual impairments...",
    },
    {
      text: "Configuring AI assistance...",
    },
    {
      text: "Setting up OCR for text extraction...",
    },
    {
      text: "Activating voice recognition & TTS...",
    },
    {
      text: "Customizing UI with light/dark modes...",
    },
    {
      text: "Optimizing for gamification & tools...",
    },
    {
      text: "Finalizing social inclusion features...",
    },
  ];

  useEffect(() => {
    // Determine if the navigation is external
    setIsExternalNavigation(!document.referrer.startsWith(window.location.origin));

    if (isFirstLoad) {
      setIsFirstLoad(false); // Prevent this effect from running again on subsequent navigations

      // If it's an external navigation, show the loading animation
      if (!document.referrer.startsWith(window.location.origin)) {
        setLoading(true); // Show loading screen

        // Cycle through loading messages
        const intervalId = setInterval(() => {
          setLoadingIndex((prevIndex) => (prevIndex + 1) % loadingStates.length);
        }, 4000 / loadingStates.length); // Divide 4 seconds by the number of messages

        // Hide loading screen after 4 seconds
        const loadingTimeout = setTimeout(() => {
          setLoading(false);
          clearInterval(intervalId); // Clear the interval when loading is done
        }, 4000);

        // Cleanup function to clear timeout and interval if the component unmounts before loading is done
        return () => {
          clearTimeout(loadingTimeout);
          clearInterval(intervalId);
        };
      }
      return; // Exit the effect after the first load
    }

    // Check if the browser supports View Transitions (type guard for newer browsers)
    if ((document as any).startViewTransition) {
      (document as any).startViewTransition(() => {
        // This is a placeholder for Next.js route change
      });
    }
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: "tween",
        ease: [0.25, 0.1, 0.25, 1], // cubic-bezier curve for smooth motion
        duration: 0.4,
      }}
      className="transition-wrapper w-full h-full"
    >
      {children}
    </motion.div>
  </AnimatePresence>
  );
}
