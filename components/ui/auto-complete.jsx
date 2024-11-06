'use client';

import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

function AutoComplete({
   triggerClassName = '',
   triggerIcon = <ChevronDown className="size-4 shrink-0" />,
   triggerPlaceHolder = 'Select',
   inputPlaceHolder = 'Search ...',
   emptyText = 'No match item found',
   items = [],
   value = '',
   setValue = () => {},
   contentAlign = 'start',
   marginFromTop = 4,
   popoverContentClassName = '',
   emptyTextClassName = '',
   itemClassName = '',
}) {
   const [open, setOpen] = useState(false);

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className={triggerClassName}>
               {value ? items.find(item => item.value === value)?.label : triggerPlaceHolder}
               <span className={`transition-all duration-150 ${open ? '-rotate-180' : ''}`}>{triggerIcon}</span>
            </Button>
         </PopoverTrigger>
         <PopoverContent align={contentAlign} sideOffset={marginFromTop} className={popoverContentClassName}>
            <Command>
               <CommandInput placeholder={inputPlaceHolder} />
               <CommandList>
                  <CommandEmpty className={emptyTextClassName}>{emptyText}</CommandEmpty>
                  <CommandGroup>
                     {items.map(item => (
                        <CommandItem
                           key={crypto.randomUUID()}
                           value={item.value}
                           onSelect={currentValue => {
                              setValue(currentValue === value ? '' : currentValue);
                              setOpen(false);
                           }}
                           className={itemClassName}
                        >
                           <Check className={cn('me-2 h-4 w-4', value === item.value ? 'opacity-100' : 'opacity-0')} />
                           {item.label}
                        </CommandItem>
                     ))}
                  </CommandGroup>
               </CommandList>
            </Command>
         </PopoverContent>
      </Popover>
   );
}

export default AutoComplete;
