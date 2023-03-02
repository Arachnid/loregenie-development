'use client';

import { isEntry, LoreSchemas, User } from '@/types';
import { Session } from 'next-auth';
import { Dispatch, SetStateAction, useState } from 'react';
import AlertDialog from '@/components/AlertDialog';
import SharingModal from '@/components/SharingModal';

type Props<T extends LoreSchemas> = {
  data: T;
  currentData: T;
  setData: Dispatch<SetStateAction<T>>;
  onSave: () => Promise<void>;
  onDelete: () => Promise<void>;
  permissions: string[];
  session: Session;
  contributors?: User[];
};

const PageHeader = <T extends LoreSchemas>({
  data,
  currentData,
  setData,
  onSave,
  onDelete,
  permissions,
  session,
  contributors,
}: Props<T>) => {
  const [showModal, setShowModal] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  return (
    <>
      <div className='flex md:justify-end items-center w-full py-2 px-4 bg-white mb-[2px]'>
        <div className='flex items-center w-full gap-4 md:w-auto h-11'>
          <div className='items-center hidden h-8 gap-2 md:flex overflow-x-clip'>
            {contributors?.map((contributor, index) => (
              <img
                className='w-8 h-8 rounded-full'
                src={contributor.image}
                alt=''
                key={index}
              />
            ))}
          </div>
          <div className='flex w-full gap-4 md:w-auto min-w-max'>
            {permissions.includes('admin') && (
              <button
                className='flex justify-center items-center py-3 px-4 gap-2 h-11 w-full md:w-[100px] rounded-lg border-2 text-[16px] font-medium bg-white border-lore-beige-500 text-lore-blue-400 transition-all duration-300 ease-out hover:bg-lore-beige-400'
                onClick={() => setShowModal(!showModal)}
              >
                {isEntry(data) ? 'Visibility' : 'Sharing'}
              </button>
            )}
            {permissions.includes('writer') && (
              <button
                className='flex justify-center items-center py-3 px-4 gap-2 h-11 w-full md:w-[100px] rounded-lg text-[16px] font-medium bg-lore-red-400 text-white transition-all duration-300 ease-out hover:bg-lore-red-500 disabled:opacity-50 disabled:hover:bg-lore-red-400'
                onClick={() => {
                  onSave();
                  window.location.reload();
                }}
                disabled={JSON.stringify(currentData) === JSON.stringify(data)}
              >
                Save
              </button>
            )}
            {permissions.includes('admin') && (
              <button
                className='flex justify-center items-center py-3 px-4 gap-2 h-11 w-full md:w-[100px] rounded-lg text-[16px] font-medium bg-lore-red-400 text-white transition-all duration-300 ease-out hover:bg-lore-red-500'
                onClick={() => setAlertOpen(true)}
              >
                Delete
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
      {alertOpen &&
        (isEntry(data) ? (
          <AlertDialog
            title={`Delete ${data.name}?`}
            alertOpen={alertOpen}
            setAlertOpen={setAlertOpen}
            action={onDelete}
          />
        ) : (
          <AlertDialog
            title={'Delete this World?'}
            description={
              'Doing so will permanently delete the data in this world, including all nested entries.'
            }
            confirmText={`Confirm that you want to delete this world by typing in its name:`}
            confirmValue={data.name}
            alertOpen={alertOpen}
            setAlertOpen={setAlertOpen}
            action={onDelete}
          />
        ))}
    </>
  );
};

export default PageHeader;
