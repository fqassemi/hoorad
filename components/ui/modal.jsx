'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = React.forwardRef(({ className, children, ...props }, ref) => (
   <DialogPrimitive.Close ref={ref} className={cn('', className)} {...props}>
      {children}
   </DialogPrimitive.Close>
));
DialogClose.displayName = DialogPrimitive.Close.displayName;

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
   <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
         'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
         className
      )}
      {...props}
   />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
   <DialogPortal>
      <DialogOverlay />
      <DialogClose />
      <DialogPrimitive.Content
         ref={ref}
         className={cn(
            'fixed sm:left-[50%] top-[50%] z-50 max-sm:inset-x-0 mx-6 sm:translate-x-[-50%] translate-y-[-50%] shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
            className
         )}
         {...props}
      >
         {children}
         <DialogPrimitive.Title className="sr-only">Dialog</DialogPrimitive.Title>
         <DialogPrimitive.Description className="sr-only">Dialog</DialogPrimitive.Description>
      </DialogPrimitive.Content>
   </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

export {
   Dialog as Modal,
   DialogPortal,
   DialogOverlay as ModalOverlay,
   DialogClose,
   DialogTrigger as ModalTrigger,
   DialogContent as ModalContent,
};
