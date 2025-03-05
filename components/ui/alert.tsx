import * as React from 'react';
    import { cva, type VariantProps } from 'class-variance-authority';

    import { cn } from '@/lib/utils';
    import { useSettings } from '@/components/settings-provider';

    const alertVariants = cva(
      'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
      {
        variants: {
          variant: {
            default: 'bg-background text-foreground',
            destructive:
              'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
            accent:
              'border-[var(--accent)]/50 text-[var(--accent)] dark:border-[var(--accent)] [&>svg]:text-[var(--accent)]',
          },
        },
        defaultVariants: {
          variant: 'default',
        },
      }
    );

    const Alert = React.forwardRef<
      HTMLDivElement,
      React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
    >(({ className, variant, ...props }, ref) => (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        style={{ backgroundColor: variant === 'accent' ? 'var(--accent)' : undefined }}
        {...props}
      />
    ));
    Alert.displayName = 'Alert';

    const AlertTitle = React.forwardRef<
      HTMLParagraphElement,
      React.HTMLAttributes<HTMLHeadingElement>
    >(({ className, ...props }, ref) => {
      const { fontSize } = useSettings();
      return (
        <h3
          ref={ref}
          className={cn('mb-1 font-medium leading-none tracking-tight', className)}
          style={{ fontSize: `${fontSize / 16 * 1.5}rem` }}
          {...props}
        />
      );
    });
    AlertTitle.displayName = 'AlertTitle';

    const AlertDescription = React.forwardRef<
      HTMLParagraphElement,
      React.HTMLAttributes<HTMLParagraphElement>
    >(({ className, ...props }, ref) => {
      const { fontSize } = useSettings();
      return (
        <div
          ref={ref}
          className={cn('text-muted-foreground [&_p]:leading-relaxed', className)}
          style={{ fontSize: `${fontSize / 16 * 0.875}rem` }}
          {...props}
        />
      );
    });
    AlertDescription.displayName = 'AlertDescription';

    export { Alert, AlertTitle, AlertDescription };
