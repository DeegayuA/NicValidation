'use client';

    import * as React from 'react';
    import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
    import { cva, type VariantProps } from 'class-variance-authority';

    import { cn } from '@/lib/utils';
    import { useSettings } from '@/components/settings-provider';

    const toggleVariants = cva(
      'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-[var(--accent)] data-[state=on]:text-primary-foreground',
      {
        variants: {
          variant: {
            default: 'bg-transparent',
            outline:
              'border border-input bg-transparent hover:bg-[var(--accent)] hover:text-accent-foreground',
          },
          size: {
            default: 'h-10 px-3',
            sm: 'h-9 px-2.5',
            lg: 'h-11 px-5',
          },
        },
        defaultVariants: {
          variant: 'default',
          size: 'default',
        },
      }
    );

    const ToggleGroupContext = React.createContext<
      VariantProps<typeof toggleVariants>
    >({
      size: 'default',
      variant: 'default',
    });

    const ToggleGroup = React.forwardRef<
      React.ElementRef<typeof ToggleGroupPrimitive.Root>,
      React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
        VariantProps<typeof toggleVariants>
    >(({ className, variant, size, children, ...props }, ref) => (
      <ToggleGroupPrimitive.Root
        ref={ref}
        className={cn('flex items-center justify-center gap-1', className)}
        {...props}
      >
        <ToggleGroupContext.Provider value={{ variant, size }}>
          {children}
        </ToggleGroupContext.Provider>
      </ToggleGroupPrimitive.Root>
    ));

    ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

    const ToggleGroupItem = React.forwardRef<
      React.ElementRef<typeof ToggleGroupPrimitive.Item>,
      React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
        VariantProps<typeof toggleVariants>
    >(({ className, children, variant, size, ...props }, ref) => {
      const context = React.useContext(ToggleGroupContext);
      const { accentColor } = useSettings();

      return (
        <ToggleGroupPrimitive.Item
          ref={ref}
          className={cn(
            toggleVariants({
              variant: context.variant || variant,
              size: context.size || size,
            }),
            className
          )}
          style={{ backgroundColor: props.style?.backgroundColor || undefined }}
          {...props}
        >
          {children}
        </ToggleGroupPrimitive.Item>
      );
    });

    ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

    export { ToggleGroup, ToggleGroupItem };
