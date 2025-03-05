import type { Config } from 'tailwindcss';
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");
 
    const config: Config = {
      darkMode: ['class'],
      content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
      ],
      theme: {
        extend: {
          backgroundImage: {
            'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            'gradient-conic':
              'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
          },
          borderRadius: {
            lg: 'var(--radius)',
            md: 'calc(var(--radius) - 2px)',
            sm: 'calc(var(--radius) - 4px)',
          },
          colors: {
            background: 'hsl(var(--background))',
            foreground: 'hsl(var(--foreground))',
            card: {
              DEFAULT: 'hsl(var(--card))',
              foreground: 'hsl(var(--card-foreground))',
            },
            popover: {
              DEFAULT: 'hsl(var(--popover))',
              foreground: 'hsl(var(--popover-foreground))',
            },
            primary: {
              DEFAULT: 'hsl(var(--primary))',
              foreground: 'hsl(var(--primary-foreground))',
            },
            secondary: {
              DEFAULT: 'hsl(var(--secondary))',
              foreground: 'hsl(var(--secondary-foreground))',
            },
            muted: {
              DEFAULT: 'hsl(var(--muted))',
              foreground: 'hsl(var(--muted-foreground))',
            },
            accent: {
              DEFAULT: 'hsl(var(--accent))',
              foreground: 'hsl(var(--accent-foreground))',
            },
            destructive: {
              DEFAULT: 'hsl(var(--destructive))',
              foreground: 'hsl(var(--destructive-foreground))',
            },
            border: 'hsl(var(--border))',
            input: 'hsl(var(--input))',
            ring: 'hsl(var(--ring))',
            chart: {
              '1': 'hsl(var(--chart-1))',
              '2': 'hsl(var(--chart-2))',
              '3': 'hsl(var(--chart-3))',
              '4': 'hsl(var(--chart-4))',
              '5': 'hsl(var(--chart-5))',
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
          },
          keyframes: {
            'accordion-down': {
              from: {
                height: '0',
              },
              to: {
                height: 'var(--radix-accordion-content-height)',
              },
            },
            'accordion-up': {
              from: {
                height: 'var(--radix-accordion-content-height)',
              },
              to: {
                height: '0',
              },
            },
          },
          animation: {
            'accordion-down': 'accordion-down 0.2s ease-out',
            'accordion-up': 'accordion-up 0.2s ease-out',
          },
          fontFamily: {
            nunito: ['Nunito', 'sans-serif'],
          },
        },
      },
      plugins: [require('tailwindcss-animate')], addVariablesForColors,
    };
    export default config;

    function addVariablesForColors({ addBase, theme }: any) {
      let allColors = flattenColorPalette(theme("colors"));
      let newVars = Object.fromEntries(
        Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
      );
     
      addBase({
        ":root": newVars,
      });
    }
