"use client";
export const APP_VERSION = "V0.0.1_Beta";

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "si", name: "සිංහල", flag: "🇱🇰" },
  { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
  { code: "af", name: "Afrikaans", flag: "🇿🇦" },
  { code: "sq", name: "Shqip", flag: "🇦🇱" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "hy", name: "Հայերեն", flag: "🇦🇲" },
  { code: "bn", name: "বাংলা", flag: "🇧🇩" },
  { code: "bs", name: "Bosanski", flag: "🇧🇦" },
  { code: "ca", name: "Català", flag: "🇪🇸" },
  { code: "hr", name: "Hrvatski", flag: "🇭🇷" },
  { code: "cs", name: "Čeština", flag: "🇨🇿" },
  { code: "da", name: "Dansk", flag: "🇩🇰" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  { code: "eo", name: "Esperanto", flag: "🇪🇪" },
  { code: "et", name: "Eesti", flag: "🇪🇪" },
  { code: "tl", name: "Filipino", flag: "🇵🇭" },
  { code: "fi", name: "Suomi", flag: "🇫🇮" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "el", name: "Ελληνικά", flag: "🇬🇷" },
  { code: "gu", name: "ગુજરાતી", flag: "🇮🇳" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "hu", name: "Magyar", flag: "🇭🇺" },
  { code: "is", name: "Íslenska", flag: "🇮🇸" },
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "jw", name: "Basa Jawa", flag: "🇮🇩" },
  { code: "ka", name: "ქართული", flag: "🇬🇪" },
  { code: "km", name: "ខ្មែរ", flag: "🇰🇭" },
  { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "la", name: "Latina", flag: "🇻🇦" },
  { code: "lv", name: "Latviešu", flag: "🇱🇻" },
  { code: "lt", name: "Lietuvių", flag: "🇱🇹" },
  { code: "mk", name: "Македонски", flag: "🇲🇰" },
  { code: "ml", name: "മലയാളം", flag: "🇮🇳" },
  { code: "mr", name: "मराठी", flag: "🇮🇳" },
  { code: "my", name: "ဗမာစာ", flag: "🇲🇲" },
  { code: "ne", name: "नेपाली", flag: "🇳🇵" },
  { code: "no", name: "Norsk", flag: "🇳🇴" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "pa", name: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "ro", name: "Română", flag: "🇷🇴" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "sr", name: "Српски", flag: "🇷🇸" },
  { code: "sk", name: "Slovenčina", flag: "🇸🇰" },
  { code: "sl", name: "Slovenščina", flag: "🇸🇮" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "su", name: "Basa Sunda", flag: "🇮🇩" },
  { code: "sw", name: "Kiswahili", flag: "🇿🇦" },
  { code: "sv", name: "Svenska", flag: "🇸🇪" },
  { code: "te", name: "తెలుగు", flag: "🇮🇳" },
  { code: "th", name: "ไทย", flag: "🇹🇭" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "uk", name: "Українська", flag: "🇺🇦" },
  { code: "ur", name: "اردو", flag: "🇵🇰" },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "cy", name: "Cymraeg", flag: "🏴" },
  { code: "xh", name: "IsiXhosa", flag: "🇿🇦" },
  { code: "yi", name: "ייִדיש", flag: "🇮🇱" },
  { code: "zu", name: "Zulu", flag: "🇿🇦" },
  { code: "zh", name: "简体中文", flag: "🇨🇳" },
  { code: "zh-TW", name: "繁體中文", flag: "🇹🇼" },
] as const;


export const GEMINI_PROMPT = `You are an AI assistant helping a person do their work independently. Based on what you see through the camera and hear from the user input, provide clear, step-by-step guidance. The user asks: "{input}". Respond in a helpful, friendly conversational tone. Focus on practical solutions and clear instructions. DO NOT LIE or make assumptions about capabilities you don't have.`;

export const THEME_COLORS = {
  primary: {
    light: 'hsl(138, 85.30%, 60.00%)',
    dark: 'hsl(123, 85.60%, 70.00%)',
  },
  secondary: {
    light: 'hsl(280, 75%, 60%)',
    dark: 'hsl(280, 75%, 70%)',
  },
  accent: {
    light: 'hsl(330, 65%, 60%)',
    dark: 'hsl(330, 65%, 70%)',
  },
  'palette-1-primary': '#0078D4',
  'palette-1-secondary': '#FFD700',
  'palette-1-background-light': '#FFFFFF',
  'palette-1-background-dark': '#1A1A1A',
  'palette-1-text-light': '#000000',
  'palette-1-text-dark': '#FFFFFF',
  'palette-2-primary': '#228B22',
  'palette-2-secondary': '#8FBC8F',
  'palette-2-background-light': '#F0F8FF',
  'palette-2-background-dark': '#2F4F4F',
  'palette-2-text-light': '#2F4F4F',
  'palette-2-text-dark': '#F0F8FF',
  'palette-3-primary': '#D64D3D',
  'palette-3-secondary': '#FF8C00',
  'palette-3-background-light': '#F5F5F5',
  'palette-3-background-dark': '#3C3C3C',
  'palette-3-text-light': '#333333',
  'palette-3-text-dark': '#FF8C00',
  'palette-4-primary': '#2A9D8F',
  'palette-4-secondary': '#264653',
  'palette-4-background-light': '#E0F7FA',
  'palette-4-background-dark': '#1A3D46',
  'palette-4-text-light': '#1A1A1A',
  'palette-4-text-dark': '#E0F7FA',
  'palette-5-primary': '#6A0DAD',
  'palette-5-secondary': '#FFD700',
  'palette-5-background-light': '#F9F9F9',
  'palette-5-background-dark': '#2D1B4D',
  'palette-5-text-light': '#4B0082',
  'palette-5-text-dark': '#FFD700',
  'palette-6-primary': '#A52A2A',
  'palette-6-secondary': '#D2B48C',
  'palette-6-background-light': '#FFF5EE',
  'palette-6-background-dark': '#3E2723',
  'palette-6-text-light': '#3E2723',
  'palette-6-text-dark': '#FFF5EE',
};

export const getRandomColor = () => {
  const h = Math.floor(Math.random() * 360); // Hue: 0-360
  const s = Math.floor(Math.random() * 50) + 50; // Saturation: 50-100%
  const lLight = Math.floor(Math.random() * 40) + 50; // Lightness for light mode: 50-90%
  const lDark = Math.floor(Math.random() * 30) + 30; // Lightness for dark mode: 30-60%

  return {
    name: 'Random',
    lightMode: `hsl(${h}, ${s}%, ${lLight}%)`,
    darkMode: `hsl(${h}, ${s}%, ${lDark}%)`,
  };
};

let newRandomColor = getRandomColor();

if (typeof window !== 'undefined') {
  const storedColor = localStorage.getItem('randomAccentColor');
  if (storedColor) {
    try {
      newRandomColor = JSON.parse(storedColor);
    } catch (error) {
      console.error("Error parsing stored color", error);
    }
  } else {
      localStorage.setItem('randomAccentColor', JSON.stringify(newRandomColor));
  }
}

export const ACCENT_COLORS = [
  newRandomColor, // Random color always updates on refresh
  { name: 'Classic Blue', lightMode: '#6a7df4', darkMode: '#394aad' },
  { name: 'Soft Green', lightMode: '#98d7b5', darkMode: '#2b6f48' },
  { name: 'Warm Orange', lightMode: '#ffb577', darkMode: '#994d19' },
  { name: 'Vibrant Purple', lightMode: '#aa88d3', darkMode: '#622b6f' },
  { name: 'Bright Yellow', lightMode: '#ffe399', darkMode: '#b38f1a' },
  { name: 'Cool Cyan', lightMode: '#8ed5e9', darkMode: '#29667e' },
  { name: 'Soft Brown', lightMode: '#d1ad86', darkMode: '#6c4d33' },
  { name: 'Muted Red', lightMode: '#ff9797', darkMode: '#992b2b' },
  { name: 'Teal Green', lightMode: '#88d3d3', darkMode: '#2b6f6f' },
];




export const LOGGED_TOKEN = '#*&&%^~!@&*%%$$#'
export const LOGGED_USER = '#*&%^!@^&*^%$*#'
export const USER = {
  ADMIN: 'ADMIN',
  VOLUNTEER: 'VOLUNTEER'
}
