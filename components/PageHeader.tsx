'use client';

import { isEntry, LoreSchemas } from '@/types';
import { Session } from 'next-auth';
import { Dispatch, SetStateAction, useState } from 'react';
import SharingModal from './SharingModal';

type Props<T extends LoreSchemas> = {
  data: T;
  currentData: T;
  setData: Dispatch<SetStateAction<T>>;
  onSave: () => Promise<void>;
  permissions: string[];
  session: Session;
};

const PageHeader = <T extends LoreSchemas>({
  data,
  currentData,
  setData,
  onSave,
  permissions,
  session,
}: Props<T>) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className='flex justify-end items-center w-full py-2 px-4 bg-white mb-[2px]'>
        <div className='flex items-center gap-4 h-11'>
          <div className='flex items-center h-8 gap-2 overflow-x-clip'>
            {!isEntry(data) &&
              data.readers.map((reader, index) => (
                <img
                  className='w-8 h-8 rounded-full min-w-max'
                  src='/no-profile-picture.svg'
                  alt=''
                  key={index}
                />
              ))}
          </div>
          <div className='flex gap-4 min-w-max'>
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
                onClick={() => onSave().then(() => alert('saved!'))}
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
      {showModal && (
        <SharingModal
          setShowModal={setShowModal}
          data={data}
          setData={setData}
          session={session}
        />
      )}
    </>
  );
};

export default PageHeader;
