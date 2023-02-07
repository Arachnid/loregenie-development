'use client';

import { useOutsideClick } from '@/hooks/useOutsideClick';
import { isEntry, LoreSchemas } from '@/types';
import { Dispatch, RefObject, SetStateAction, useState } from 'react';
import SharingModal from './SharingModal';

type Props<T extends LoreSchemas> = {
  data: T;
  setData: Dispatch<SetStateAction<T>>;
  onSave: () => Promise<void>;
  permissions: string[];
};

const PageHeader = <T extends LoreSchemas>({
  data,
  setData,
  onSave,
  permissions,
}: Props<T>) => {
  const [showModal, setShowModal] = useState(false);
  const modalRef: RefObject<HTMLDivElement> = useOutsideClick<HTMLDivElement>(
    () => setShowModal(false)
  );

  return (
    <>
      <div className='flex justify-end items-center w-full py-2 px-4 bg-white mb-[2px] min-w-max'>
        <div className='flex items-center gap-4 h-11'>
          <div className='flex items-center h-8 gap-2'>
            <img className='w-8 h-8 rounded-full' src='/favicon.ico' alt='' />
            <img className='w-8 h-8 rounded-full' src='/favicon.ico' alt='' />
            <img className='w-8 h-8 rounded-full' src='/favicon.ico' alt='' />
          </div>
          {permissions.includes('admin') && (
            <button
              className='flex justify-center items-center py-3 px-4 gap-2 h-11 w-[100px] rounded-lg border-2 text-[16px] font-medium bg-white border-lore-beige-500 text-lore-blue-400 transition-all duration-300 ease-out hover:bg-lore-beige-400'
              onClick={() => setShowModal(!showModal)}
            >
              {isEntry(data) ? 'Visibility' : 'Sharing'}
            </button>
          )}
          {permissions.includes('writer') && (
            <button
              className='flex justify-center items-center py-3 px-4 gap-2 h-11 w-[100px] rounded-lg border-2 text-[16px] font-medium border-lore-red-400 bg-lore-red-400 text-white transition-all duration-300 ease-out hover:bg-lore-red-500 hover:border-lore-red-500'
              onClick={() => onSave()}
            >
              Save
            </button>
          )}
        </div>
      </div>
      {showModal && (
        <SharingModal
          modalRef={modalRef}
          setShowModal={setShowModal}
          data={data}
          setData={setData}
        />
      )}
    </>
  );
};

export default PageHeader;
