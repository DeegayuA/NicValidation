'use client';

    import * as React from 'react';
    import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
    import { Circle } from 'lucide-react';

    import { cn } from '@/lib/utils';
    import { useSettings } from '@/components/settings-provider';

    const RadioGroup = React.forwardRef<
      React.ElementRef<typeof RadioGroupPrimitive.Root>,
      React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
    >(({ className, ...props }, ref) => {
      const { accentColor } = useSettings();
      return (
        <RadioGroupPrimitive.Root
          ref={ref}
          className={cn('grid gap-2', className)}
          {...props}
        />
      );
    });
    RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

    const RadioGroupItem = React.forwardRef<
      React.ElementRef<typeof RadioGroupPrimitive.Item>,
      React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
    >(({ className, ...props }, ref) => {
      const { fontSize, accentColor } = useSettings();
      return (
        <RadioGroupPrimitive.Item
          ref={ref}
          className={cn(
            'aspect-square h-4 w-4 rounded-full border border-[var(--accent)] text-[var(--accent)] ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          style={{ backgroundColor: props.style?.backgroundColor || undefined, borderColor: accentColor, color: accentColor, fontSize: `${fontSize / 16 * 0.875}rem` }}
          {...props}
        >
          <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
            <Circle className="h-2.5 w-2.5 fill-current text-current" />
          </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>
      );
    });
    RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

    export { RadioGroup, RadioGroupItem };
