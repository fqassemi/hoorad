'use client';

import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetPortal = SheetPrimitive.Portal;

const SheetClose = React.forwardRef(({ className, children, ...props }, ref) => (
   <SheetPrimitive.Close ref={ref} className={cn('', className)} {...props}>
      {children}
   </SheetPrimitive.Close>
));
SheetClose.displayName = SheetPrimitive.Close.displayName;

const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => (
   <SheetPrimitive.Overlay
      className={cn(
         'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
         className
      )}
      {...props}
      ref={ref}
   />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
   'fixed z-50 overflow-auto bg-background shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out',
   {
      variants: {
         side: {
            top: 'inset-x-0 top-0 data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
            bottom: 'inset-x-0 bottom-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
            left: 'inset-y-0 left-0 w-3/4 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
            right: 'inset-y-0 right-0 w-3/4 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
         },
      },
      defaultVariants: {
         side: 'right',
      },
   }
);

const SheetContent = React.forwardRef(({ side = 'right', className, children, ...props }, ref) => (
   <SheetPortal>
      <SheetOverlay />
      <SheetClose />
      <SheetPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
         <SheetPrimitive.Title className="sr-only">Sheet</SheetPrimitive.Title>
         <SheetPrimitive.Description className="sr-only">Sheet</SheetPrimitive.Description>
         {children}
      </SheetPrimitive.Content>
   </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

export { Sheet, SheetPortal, SheetOverlay, SheetTrigger, SheetClose, SheetContent };
