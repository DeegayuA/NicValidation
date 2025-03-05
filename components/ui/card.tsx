"use client";

    import * as React from 'react';

    import { cn } from '@/lib/utils';
    import { useSettings } from '@/components/settings-provider';

    const Card = React.forwardRef<
      HTMLDivElement,
      React.HTMLAttributes<HTMLDivElement>
    >(({ className, ...props }, ref) => {
      const { accentColor } = useSettings();
      return (
        <div
          ref={ref}
          className={cn(
            'rounded-lg border bg-card text-card-foreground shadow-sm',
            className
          )}
          style={{ backgroundColor: props.style?.backgroundColor || undefined }}
          {...props}
        />
      );
    });
    Card.displayName = 'Card';

    const CardHeader = React.forwardRef<
      HTMLDivElement,
      React.HTMLAttributes<HTMLDivElement>
    >(({ className, ...props }, ref) => (
      <div
        ref={ref}
        className={cn('flex flex-col space-y-1.5 p-6', className)}
        {...props}
      />
    ));
    CardHeader.displayName = 'CardHeader';

    const CardTitle = React.forwardRef<
      HTMLParagraphElement,
      React.HTMLAttributes<HTMLHeadingElement>
    >(({ className, ...props }, ref) => {
      const { fontSize } = useSettings();
      return (
        <h3
          ref={ref}
          className={cn(
            'font-semibold leading-none tracking-tight',
            className
          )}
          style={{ fontSize: `${fontSize / 16 * 1.5}rem` }}
          {...props}
        />
      );
    });
    CardTitle.displayName = 'CardTitle';

    const CardDescription = React.forwardRef<
      HTMLParagraphElement,
      React.HTMLAttributes<HTMLParagraphElement>
    >(({ className, ...props }, ref) => {
      const { fontSize } = useSettings();
      return (
        <p
          ref={ref}
          className={cn('text-muted-foreground', className)}
          style={{ fontSize: `${fontSize / 16 * 0.875}rem` }}
          {...props}
        />
      );
    });
    CardDescription.displayName = 'CardDescription';

    const CardContent = React.forwardRef<
      HTMLDivElement,
      React.HTMLAttributes<HTMLDivElement>
    >(({ className, ...props }, ref) => (
      <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
    ));
    CardContent.displayName = 'CardContent';

    const CardFooter = React.forwardRef<
      HTMLDivElement,
      React.HTMLAttributes<HTMLDivElement>
    >(({ className, ...props }, ref) => (
      <div
        ref={ref}
        className={cn('flex items-center p-6 pt-0', className)}
        {...props}
      />
    ));
    CardFooter.displayName = 'CardFooter';

    export {
      Card,
      CardHeader,
      CardFooter,
      CardTitle,
      CardDescription,
      CardContent,
    };
