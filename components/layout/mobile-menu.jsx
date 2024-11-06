'use client';

// Next
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// React
import { useEffect, useState } from 'react';

// Components
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Hooks
import useOnClickOutside from '@/hooks/useOnclickOutside';

function MobileMenu() {
   const [showMenu, setShowMenu] = useState(false);
   const { push } = useRouter();
   const pathName = usePathname();
   const searchParams = useSearchParams();

   const openMobileMenu = () => {
      setShowMenu(true);
      const params = new URLSearchParams(searchParams.toString());
      params.set('mobile-menu', 'open');
      push(`${pathName}?${params.toString()}`);
   };

   const closeMobileMenu = () => {
      setShowMenu(false);
      const params = new URLSearchParams(searchParams.toString());
      params.delete('mobile-menu');
      push(`${pathName}?${params.toString()}`);
   };

   useEffect(() => {
      if (searchParams.get('mobile-menu') === 'open') {
         setShowMenu(true);
      } else {
         setShowMenu(false);
      }
   }, [searchParams]);

   const [ref] = useOnClickOutside(closeMobileMenu);

   return (
      <>
         <Button className="text-customWhite1" onClick={openMobileMenu}>
            <svg className="size-5">
               <use href="#menu" />
            </svg>
         </Button>
         <Sheet open={showMenu}>
            <SheetContent className="w-full max-w-[300px] rounded-bl-[8px]" ref={ref}>
               <div>
                  <div
                     className="sticky top-0 z-[1] flex h-14 items-center justify-between bg-white px-4"
                     style={{
                        boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.08), 0px 1px 2px 0px rgba(0, 0, 0, 0.08)',
                     }}
                  >
                     <Link href="/" className="relative block h-10 w-15">
                        <Image src="/images/logo3.png" fill alt="logo" priority sizes="60px" />
                     </Link>
                     <Button onClick={closeMobileMenu}>
                        <svg className="size-10 text-customGray2">
                           <use href="#close" />
                        </svg>
                     </Button>
                  </div>
                  <div className="mt-8 flex flex-col gap-5 px-6 pb-10 text-customBlack2">
                     <Accordion type="multiple" className="w-full space-y-5">
                        <AccordionItem value="item-1">
                           <AccordionTrigger>
                              <div className="flex items-center gap-x-1">
                                 <p className="text-sm">Trade stats</p>
                                 <svg className="size-4 transition-all duration-200" id="arrowSvg">
                                    <use href="#arrow-right" />
                                 </svg>
                              </div>
                           </AccordionTrigger>
                           <AccordionContent className="mt-2 bg-customWhite2 px-3 py-2">
                              <ul className="ml-1 list-inside list-disc space-y-3 text-xs text-customBlack1">
                                 <AccordionItem value="item-4">
                                    <AccordionTrigger>
                                       <div className="flex items-center gap-x-1">
                                          <li>by country</li>
                                          <svg className="size-4 transition-all duration-200" id="arrowSvg">
                                             <use href="#arrow-right" />
                                          </svg>
                                       </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="mt-2 bg-white px-3 py-2">
                                       <ul className="ml-1 list-inside list-disc space-y-5 text-xs text-customBlack1">
                                          <div className="space-y-1">
                                             <li className="">north america</li>
                                             <ol className="list-inside list-decimal space-y-1">
                                                <li>canada</li>
                                                <li>america</li>
                                                <li>mexic</li>
                                             </ol>
                                          </div>
                                          <div className="space-y-1">
                                             <li className="">south america</li>
                                             <ol className="list-inside list-decimal space-y-1">
                                                <li>argentina</li>
                                                <li>brazil</li>
                                                <li>mexic</li>
                                             </ol>
                                          </div>
                                          <div className="space-y-1">
                                             <li className="">europe</li>
                                             <ol className="list-inside list-decimal space-y-1">
                                                <li>german</li>
                                             </ol>
                                          </div>
                                       </ul>
                                    </AccordionContent>
                                 </AccordionItem>

                                 <li className="">by commodity</li>
                                 <li className="">by hscode</li>
                                 <li className="">by port</li>
                                 <li className="">by country</li>
                              </ul>
                           </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-2">
                           <AccordionTrigger>
                              <div className="flex items-center gap-x-1">
                                 <p className="text-sm">Global industries</p>
                                 <svg className="size-4 transition-all duration-200" id="arrowSvg">
                                    <use href="#arrow-right" />
                                 </svg>
                              </div>
                           </AccordionTrigger>
                           <AccordionContent className="mt-2 bg-customWhite2 px-3 py-2">
                              <ul className="ml-1 list-inside list-disc space-y-3 text-xs text-customBlack1">
                                 <li className="">agriculture</li>
                                 <li className="">mining</li>
                                 <li className="">oil and gas</li>
                                 <li className="">chemicals</li>
                                 <li className="">manufacturing</li>
                                 <li className="">technology and science</li>
                                 <li className="">transportation and logistics</li>
                                 <li className="">renewable energy</li>
                                 <li className="">finance and economics</li>
                                 <li className="">environmental sustainability</li>
                              </ul>
                           </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-3">
                           <AccordionTrigger>
                              <div className="flex items-center gap-x-1">
                                 <p className="text-sm">Trade assistance</p>
                                 <svg className="size-4 transition-all duration-200" id="arrowSvg">
                                    <use href="#arrow-right" />
                                 </svg>
                              </div>
                           </AccordionTrigger>
                           <AccordionContent className="mt-2 bg-customWhite2 px-3 py-2">
                              <ul className="ml-1 list-inside list-disc space-y-3 text-xs text-customBlack1">
                                 <li className="">i am importer</li>
                                 <li className="">i am exporter</li>
                                 <li className="">ai trade consultant</li>
                              </ul>
                           </AccordionContent>
                        </AccordionItem>
                     </Accordion>

                     <Link href="/" className="text-sm">
                        About us
                     </Link>
                     <Link href="/" className="text-sm">
                        Contact us
                     </Link>
                  </div>
               </div>
            </SheetContent>
         </Sheet>
      </>
   );
}

export default MobileMenu;
