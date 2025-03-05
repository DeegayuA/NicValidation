"use client";

    import * as React from 'react';
    import { Slot } from '@radix-ui/react-slot';
    import { cva, type VariantProps } from 'class-variance-authority';

    import { cn } from '@/lib/utils';
    import { useSettings } from '@/components/settings-provider';

    const buttonVariants = cva(
      'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      {
        variants: {
          variant: {
            default:
              'bg-primary text-primary-foreground hover:filter hover:brightness-110 hover:hue-rotate(10deg)',
            accent:
              'text-foreground hover:filter hover:brightness-110 hover:hue-rotate(10deg)',
            destructive:
              'bg-destructive text-destructive-foreground hover:filter hover:brightness-110 hover:hue-rotate(10deg)',
            outline:
              'border-2 border-input bg-background text-foreground hover:filter hover:brightness-110 hover:hue-rotate(10deg)',
            secondary:
              'bg-secondary text-secondary-foreground hover:filter hover:brightness-110 hover:hue-rotate(10deg)',
            ghost:
              'bg-transparent text-foreground hover:filter hover:brightness-110 hover:hue-rotate(10deg) hover:bg-muted/10 hover:text-accent-foreground',
            link: 'text-primary underline-offset-4 hover:underline',
          },
          size: {
            default: 'h-10 px-4 py-2',
            sm: 'h-9 rounded-md px-3',
            lg: 'h-11 rounded-md px-8',
            icon: 'h-10 w-10',
          },
        },
        defaultVariants: {
          variant: 'default',
          size: 'default',
        },
      }
    );

    export interface ButtonProps
      extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
      asChild?: boolean;
    }

    const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
      ({ className, variant, size, asChild = false, ...props }, ref) => {
        const { accentColor, fontSize } = useSettings();
        
        const Comp = asChild ? Slot : 'button';
        return (
          <Comp
            className={cn(buttonVariants({ variant, size, className }), variant === 'accent' && 'bg-[var(--accent)]')}
            ref={ref}
            style={{ fontSize: `${fontSize / 16 * 0.875}rem`, backgroundColor: variant === 'default' ? accentColor : undefined }}
            {...props}
          />
        );
      }
    );
    Button.displayName = 'Button';

    export { Button, buttonVariants };
