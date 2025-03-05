import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Original cn function using clsx and twMerge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// New cn function that just joins class names with space
export function joinClassNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
