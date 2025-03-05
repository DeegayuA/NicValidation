'use client';

    import * as React from 'react';
    import * as MenuPrimitive from '@radix-ui/react-menu';

    import { cn } from '@/lib/utils';
    import { useSettings } from '@/components/settings-provider';

    const Menu = MenuPrimitive.Root;
    const MenuPortal = MenuPrimitive.Portal;

    const MenuContent = React.forwardRef<
      React.ElementRef<typeof MenuPrimitive.Content>,
      React.ComponentPropsWithoutRef<typeof MenuPrimitive.Content>
    >(({ className, align = 'start', sideOffset = 4, ...props }, ref) => (
      <MenuPrimitive.Portal>
        <MenuPrimitive.Content
          ref={ref}
          align={align}
          sideOffset={sideOffset}
          className={cn(
            'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            className
          )}
          {...props}
        />
      </MenuPrimitive.Portal>
    ));
    MenuContent.displayName = MenuPrimitive.Content.displayName;

    const MenuItem = React.forwardRef<
      React.ElementRef<typeof MenuPrimitive.Item>,
      React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item>
    >(({ className, ...props }, ref) => {
      const { fontSize, accentColor } = useSettings();
      return (
        <MenuPrimitive.Item
          ref={ref}
          className={cn(
            'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-[var(--accent)] focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            className
          )}
          style={{ fontSize: `${fontSize / 16 * 0.875}rem`, backgroundColor: props.style?.backgroundColor || undefined }}
          {...props}
        />
      );
    });
    MenuItem.displayName = MenuPrimitive.Item.displayName;

    const MenuLabel = React.forwardRef<
      React.ElementRef<typeof MenuPrimitive.Label>,
      React.ComponentPropsWithoutRef<typeof MenuPrimitive.Label>
    >(({ className, ...props }, ref) => {
      const { fontSize } = useSettings();
      return (
        <MenuPrimitive.Label
          ref={ref}
          className={cn('px-2 py-1.5 font-semibold', className)}
          style={{ fontSize: `${fontSize / 16 * 0.875}rem` }}
          {...props}
        />
      );
    });
    MenuLabel.displayName = MenuPrimitive.Label.displayName;

    const MenuSeparator = React.forwardRef<
      React.ElementRef<typeof MenuPrimitive.Separator>,
      React.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
      <MenuPrimitive.Separator
        ref={ref}
        className={cn('-mx-1 my-1 h-px bg-muted', className)}
        {...props}
      />
    ));
    MenuSeparator.displayName = MenuPrimitive.Separator.displayName;

    export {
      Menu,
      MenuContent,
      MenuItem,
      MenuLabel,
      MenuSeparator,
      MenuPortal,
    };
