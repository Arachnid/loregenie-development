'use client';

import { useOutsideClick } from '@/hooks/useOutsideClick';
import { RefObject, useState } from 'react';
import SharingModal from './SharingModal';

type Props = {};

const PageHeader = (props: Props) => {
  const [showModal, setShowModal] = useState(false);
  const modalRef: RefObject<HTMLDivElement> = useOutsideClick<HTMLDivElement>(
    () => setShowModal(false)
  );

  return (
    <>
      <div className='flex justify-end items-center w-full py-2 px-4 bg-white mb-[2px] min-w-max'>
        <div className='flex items-center gap-4 h-11'>
          <div className='flex items-center gap-2 h-8'>
            <img className='rounded-full h-8 w-8' src='/favicon.ico' alt='' />
            <img className='rounded-full h-8 w-8' src='/favicon.ico' alt='' />
            <img className='rounded-full h-8 w-8' src='/favicon.ico' alt='' />
          </div>
          <button
            className='flex justify-center items-center py-3 px-4 gap-2 h-11 w-[100px] rounded-lg border-2 text-[16px] font-medium border-lore-beige text-lore-blue'
            onClick={() => setShowModal(!showModal)}
          >
            Sharing
          </button>
          <button className='flex justify-center items-center py-3 px-4 gap-2 h-11 w-[100px] rounded-lg border-2 text-[16px] font-medium border-lore-red bg-lore-red text-white'>
            Save
          </button>
        </div>
      </div>
      {showModal && (
        <SharingModal modalRef={modalRef} setShowModal={setShowModal} />
      )}
    </>
  );
};

export default PageHeader;
