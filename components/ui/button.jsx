import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
   'relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0',
   {
      variants: {
         variant: {
            default: '',
            main: 'disabled:bg-customGray1 disabled:text-customWhite1',
            outline:
               'border hover:border-customBlue1 hover:text-customBlue1 active:border-customBlack1 active:bg-gray-100 active:text-customBlack1 disabled:border-customGray1 disabled:text-customGray1',
            link: 'hover:text-customBlue1 active:text-customBlack1 disabled:text-customGray1',
         },
         size: {
            default: '',
            main: 'h-10 px-4 py-2',
            sm: 'h-9 rounded-md px-3',
            lg: 'h-11 rounded-md px-8',
            icon: 'size-10',
         },
         color: {
            orange: 'bg-customOrange text-white hover:bg-orange-400 active:bg-orange-700',
         },
      },
      defaultVariants: {
         variant: 'default',
         size: 'default',
      },
   }
);

const Button = React.forwardRef(
   (
      { className, variant, size, color, type = 'button', asChild = false, loading, disabled, children, ...props },
      ref
   ) => {
      const Comp = asChild ? Slot : 'button';
      return (
         <Comp
            className={cn(buttonVariants({ variant, size, color, className }))}
            ref={ref}
            type={type}
            {...props}
            disabled={loading || disabled}
         >
            <div
               className={`absolute inset-0 flex items-center justify-center bg-customGray1 transition-all duration-200 ${
                  loading ? 'visible opacity-100' : 'invisible opacity-0'
               }`}
            >
               <Loader2 className="size-4 animate-spin text-customWhite1 lg:size-5" />
            </div>
            {children}
         </Comp>
      );
   }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
