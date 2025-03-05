'use client';

    import * as React from 'react';
    import * as LabelPrimitive from '@radix-ui/react-label';
    import { cva, type VariantProps } from 'class-variance-authority';
    import { useSettings } from '@/components/settings-provider';

    import { cn } from '@/lib/utils';

    const labelVariants = cva(
      'font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
    );

    const Label = React.forwardRef<
      React.ElementRef<typeof LabelPrimitive.Root>,
      React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
        VariantProps<typeof labelVariants>
    >(({ className, ...props }, ref) => {
      const { fontSize } = useSettings();
      return (
        <LabelPrimitive.Root
          ref={ref}
          className={cn(labelVariants(), className)}
          style={{ fontSize: `${fontSize / 16 * 0.875}rem` }}
          {...props}
        />
      );
    });
    Label.displayName = LabelPrimitive.Root.displayName;

    export { Label };
