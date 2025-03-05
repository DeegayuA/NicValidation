import { FlipWords } from "./ui/flip-words";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { useSettings } from '@/components/settings-provider';
import { Playfair_Display } from 'next/font/google';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-playfair',
});
export function PlaceholdersAndVanishInputDemo() {
  const { fontSize, highContrast, accentColor } = useSettings(); // Access settings for fontSize and highContrast
  const placeholders = [];

function generateOldNIC() {
    const year = Math.floor(Math.random() * (99 - 50 + 1)) + 50; // Random year from 50-99
    const day = Math.floor(Math.random() * 366) + 1; // Random day of the year
    const serial = Math.floor(Math.random() * 999) + 1; // Random serial number
    const checkDigit = Math.floor(Math.random() * 9) + 1; // Random check digit
    const voterLetter = Math.random() > 0.8 ? 'X' : 'V'; // Mostly 'V', sometimes 'X'
    return `${year}${String(day).padStart(3, '0')}${String(serial).padStart(3, '0')}${checkDigit}${voterLetter}`;
}

function generateNewNIC() {
    const year = Math.floor(Math.random() * (2024 - 1950 + 1)) + 1950; // Random year from 1950-2024
    const day = Math.floor(Math.random() * 366) + 1; // Random day of the year
    const serial = Math.floor(Math.random() * 9999) + 1; // Random serial number
    const checkDigit = Math.floor(Math.random() * 9) + 1; // Random check digit
    return `${year}${String(day).padStart(3, '0')}${String(serial).padStart(4, '0')}${checkDigit}`;
}

for (let i = 0; i < 10; i++) {
    placeholders.push(generateOldNIC());
    placeholders.push(generateNewNIC());
}

  const words = [
    "NIC number",
  ];
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <div
      className="h-full flex flex-col justify-center items-center px-4 z-40"
      style={{
        fontSize: `${fontSize / 16}rem`,
      }}
    >
<h1
  className={`${playfairDisplay.variable} font-playfair mb-5 sm:mb-10 text-xl text-center sm:text-5xl font-bold tracking-tight text-neutral-700 dark:text-neutral-100 relative`}
  style={{
    fontSize: `${fontSize / 16 * 3}rem`,
    color: highContrast ? "var(--color-accent)" : accentColor,
    padding: "0.5rem",
    borderRadius: "8px", 
    backdropFilter: "blur(10px)",
    backgroundColor: highContrast ? "var(--color-background)" : "var(--color-background-100)",
  }}
  aria-live="polite"
>
  Enter your
  <FlipWords words={words} /> <br />
  or upload the file
</h1>
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
        aria-label="Text input for NIC Validation"
        
      />
    </div>
  );
}
