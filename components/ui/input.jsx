import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef(
   (
      {
         inputClassName,
         wrapperClassName,
         type,
         disableWheelEffect = true,
         hideInnerSpins = true,
         errorMessage,
         error,
         startIcon,
         endIcon,
         startIconClassName,
         endIconClassName,
         labelText,
         labelClassName,
         ...props
      },
      ref
   ) => (
      <div className={wrapperClassName}>
         <div className="relative">
            {startIcon && (
               <div className={`absolute start-3 top-1/2 -translate-y-1/2 ${startIconClassName}`}>{startIcon}</div>
            )}
            {endIcon && <div className={`absolute end-3 top-1/2 -translate-y-1/2 ${endIconClassName}`}>{endIcon}</div>}
            {labelText && <p className={labelClassName}>{labelText}</p>}
            <input
               type={type}
               className={cn(
                  `w-full disabled:cursor-not-allowed outline-none disabled:opacity-50 ${hideInnerSpins ? 'hide-spin' : ''} ${error ? '!border-errorRed' : ''}`,
                  inputClassName
               )}
               ref={ref}
               {...props}
               onFocus={e => {
                  if (disableWheelEffect) {
                     e.target.addEventListener(
                        'wheel',
                        event => {
                           event.preventDefault();
                        },
                        { passive: false }
                     );
                  }
               }}
            />
         </div>
         {errorMessage && <p className="ms-2 mt-1.5 text-[11px] font-medium text-errorRed">{errorMessage}</p>}
      </div>
   )
);
Input.displayName = 'Input';

// eslint-disable-next-line import/prefer-default-export
export { Input };
