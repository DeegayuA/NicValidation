import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import cn from "classnames";
import { useSettings } from "@/components/settings-provider";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

interface HoverBorderGradientProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  containerClassName?: string;
  className?: string;
  as?: React.ElementType;
  duration?: number;
  clockwise?: boolean;
}

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1,
  clockwise = true,
  ...props
}: HoverBorderGradientProps) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [direction, setDirection] = useState<Direction>("TOP");
  const { accentColor } = useSettings();

  const rotateDirection = (currentDirection: Direction): Direction => {
    const directions: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
    const currentIndex = directions.indexOf(currentDirection);
    const nextIndex = clockwise
      ? (currentIndex - 1 + directions.length) % directions.length
      : (currentIndex + 1) % directions.length;
    return directions[nextIndex];
  };

  const movingMap: Record<Direction, string> = {
    TOP: "radial-gradient(20.7% 50% at 50% 0%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    BOTTOM:
      "radial-gradient(20.7% 50% at 50% 100%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    RIGHT:
      "radial-gradient(16.2% 41.199999999999996% at 100% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
  };

  const highlight =
    `radial-gradient(75% 181.15942028985506% at 50% 50%, ${
      document.documentElement.classList.contains("dark")
        ? "#FFFFFF" // White for dark mode
        : "#000000" // Blue for light mode
    } 0%, rgba(255, 255, 255, 0) 100%)`;

  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prevState) => rotateDirection(prevState));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered, duration]);

  const contentDiv = (
    <div
      className={cn(
        "w-auto text-white z-10 px-4 py-2 rounded-[inherit]",
        className
      )}
    >
      {children}
    </div>
  );

  const motionDiv = (
    <motion.div
      className={cn(
        "flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
      )}
      style={{
        filter: "blur(1px)",
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: accentColor,
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: movingMap[direction],
        }}
        animate={{
          background: hovered ? [movingMap[direction], highlight] : movingMap[direction],
        }}
        transition={{ ease: "linear", duration: duration ?? 1 }}
      />
    </motion.div>
  );

  const backgroundDiv = (
    <div className="absolute z-1 flex-none inset-[2px] rounded-[100px]" style={{ backgroundColor: accentColor }}/>
  );

  return (
    React.createElement(Tag, {
      ...props,
      className: cn(
        "relative flex bg-white rounded-full border content-center transition duration-500 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone w-fit",
        containerClassName,
        className
      ),
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      children: (
        <>
          {contentDiv}
          {motionDiv}
          {backgroundDiv}
        </>
      ),
    })
  );
}