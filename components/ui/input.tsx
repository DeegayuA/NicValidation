"use client";

    import * as React from 'react';

    import { cn } from '@/lib/utils';
    import { useSettings } from '@/components/settings-provider';

    export interface InputProps
      extends React.InputHTMLAttributes<HTMLInputElement> {}

    const Input = React.forwardRef<HTMLInputElement, InputProps>(
      ({ className, type, onKeyPress, ...props }, ref) => {
        const { fontSize } = useSettings();
        const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (props.onKeyDown) {
                props.onKeyDown(e);
            }
          }
        };
        return (
          <input
            type={type}
            className={cn(
              'flex w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 h-10',
              className
            )}
            ref={ref}
            style={{ fontSize: `${fontSize / 16 * 0.875}rem` }}
            onKeyPress={handleKeyPress}
            {...props}
          />
        );
      }
    );
    Input.displayName = 'Input';

    export { Input };
