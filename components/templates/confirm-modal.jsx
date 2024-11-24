'use client';

// Icons
import { IoMdClose } from 'react-icons/io';

// Hooks
import useOnClickOutside from '@/hooks/useOnclickOutside';

// Components
import { Modal, ModalContent } from '../ui/modal';
import { Button } from '../ui/button';

function ConfirmModal({ open, onClose = () => {}, title, onConfirmClick = () => {}, confirmIsLoading = false }) {
   const closeModalHandler = () => {
      onClose();
   };

   const [ref] = useOnClickOutside(closeModalHandler);

   return (
      <Modal open={open}>
         <ModalContent ref={ref} className="rounded-lg bg-white px-5 py-3">
            <div>
               <div className="border-b border-gray-300">
                  <Button onClick={closeModalHandler} className="transition-all duration-200 hover:text-red-700">
                     <IoMdClose className="text-2xl" />
                  </Button>
               </div>
               <p className="mt-4 text-lg">{title}</p>

               <div className="mt-6 flex items-center gap-2 child:py-1.5 child:text-sm child:text-white child:transition-all child:duration-200">
                  <Button
                     variant="main"
                     className="flex-1 bg-green-500 hover:bg-green-700"
                     onClick={onConfirmClick}
                     loading={confirmIsLoading}
                  >
                     تایید
                  </Button>
                  <Button
                     variant="main"
                     className="flex-1 bg-red-500 hover:bg-red-700"
                     onClick={closeModalHandler}
                     disabled={confirmIsLoading}
                  >
                     انصراف
                  </Button>
               </div>
            </div>
         </ModalContent>
      </Modal>
   );
}

export default ConfirmModal;
