"use client";

    import { useSettings } from '@/components/settings-provider';
    import { cn } from '@/lib/utils';
    import { THEME_COLORS } from '@/lib/constants';

    export function LayoutWrapper({ children }: { children: React.ReactNode }) {
      const {
        fontSize,
        lineHeight,
        letterSpacing,
        reducedMotion,
        highContrast,
        screenReader,
        antiFlicker,
        accentColor,
        palette,
      } = useSettings();

      // Determine aria-live value based on the screenReader setting
      const ariaLiveValue = screenReader ? 'polite' : 'off';

      // const selectedPalette = THEME_COLORS[palette as keyof typeof THEME_COLORS] || THEME_COLORS['palette-1'];

      return (
        <div
          style={{
            fontSize: `${fontSize / 16}rem`,
            lineHeight,
            letterSpacing: `${letterSpacing}px`,
            // '--palette-primary': selectedPalette.primary,
            // '--palette-secondary': selectedPalette.secondary,
            // '--palette-background-light': selectedPalette.backgroundLight,
            // '--palette-background-dark': selectedPalette.backgroundDark,
            // '--palette-text-light': selectedPalette.textLight,
            // '--palette-text-dark': selectedPalette.textDark,
          }}
          className={cn(
            reducedMotion ? 'transition-none' : '',
            highContrast ? 'high-contrast' : '',
            antiFlicker ? 'no-flicker' : '',
            `accent-[${accentColor}]`,
            // `palette-[${palette}]`,
            // `text-[var(--palette-text-light)]`,
            // `bg-[var(--palette-background-light)]`,
            // `dark:text-[var(--palette-text-dark)]`,
            // `dark:bg-[var(--palette-background-dark)]`
          )}
          aria-live={ariaLiveValue} // Valid ARIA value passed
        >
          {children}
        </div>
      );
    }
