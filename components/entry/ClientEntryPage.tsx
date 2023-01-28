'use client';

import { Entry } from '@/types';
import Button from '@mui/material/Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AlertDialog from '../AlertDialog';

interface Props {
  entry: Entry;
  worldID: string;
  permissions: string[];
}

const ClientEntryPage = ({ entry, worldID, permissions }: Props) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    try {
      await fetch('/api/entry/delete', {
        method: 'POST',
        body: JSON.stringify({ entryID: entry.id, worldID, permissions }),
      });
      router.push(`/world/${worldID}`);
      router.refresh();
    } catch (error) {
      console.log('error deleting entry: ', error);
    }
  };

  return (
    <div className='flex flex-col w-full h-full'>
      <div className='flex justify-end items-center w-full py-2 px-4 bg-white mb-[2px]'>
        <div className='flex items-center gap-4 h-11'>
          <div className='flex items-center gap-2 h-8'>
            <div className='relative border border-black rounded-full h-8 w-8'>
              <Image src={'/favicon.ico'} alt='' fill />
            </div>
            <div className='relative border border-black rounded-full h-8 w-8'>
              <Image src={'/favicon.ico'} alt='' fill />
            </div>
            <div className='relative border border-black rounded-full h-8 w-8'>
              <Image src={'/favicon.ico'} alt='' fill />
            </div>
          </div>
          <button className='flex justify-center items-center py-3 px-4 gap-2 h-11 w-[100px] rounded-lg border-2 text-[16px] font-medium border-lore-beige text-lore-blue'>
            Sharing
          </button>
          <button className='flex justify-center items-center py-3 px-4 gap-2 h-11 w-[100px] rounded-lg border-2 text-[16px] font-medium border-lore-red bg-lore-red text-white'>
            Save
          </button>
        </div>
      </div>
      <div className='flex flex-col h-full bg-white py-6 px-16 gap-10 isolate overflow-y-scroll'>
        <h1>name: {entry.name}</h1>
        <div className=''>
          Lorem ipsum, dolor sit amet consectetur asdas wadasdsd dwsdsd awasdsd wasdasd wdasdsds
        </div>
        <div>image: {entry.image}</div>
        {entry.parent && <div>parent: {entry.parent.name}</div>}
        <div>visibility: {entry.public ? 'public' : 'private'}</div>
        {permissions.includes('writer') && (
          <Button
            variant='contained'
            sx={{ margin: 1 }}
            onClick={() =>
              router.push(`/world/${worldID}/entry/${entry.id}/edit`)
            }
          >
            Edit {entry.category}
          </Button>
        )}
        {permissions.includes('admin') && (
          <Button
            variant='contained'
            sx={{ margin: 1 }}
            color='error'
            onClick={() => setAlertOpen(true)}
          >
            Delete {entry.category}
          </Button>
        )}
        {alertOpen && (
          <AlertDialog
            title={`Delete ${entry.name}?`}
            alertOpen={alertOpen}
            setAlertOpen={setAlertOpen}
            action={onDelete}
          />
        )}
      </div>
    </div>
  );
};

export default ClientEntryPage;
