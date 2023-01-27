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
      <div className='flex justify-end items-center w-full h-14 bg-white mb-[3px]'>
        <div className='flex mr-4'>
          <div className='relative border border-black rounded-full h-5 w-5 ml-1'>
            <Image src={'/favicon.ico'} alt='' fill />
          </div>
          <div className='relative border border-black rounded-full h-5 w-5 ml-1'>
            <Image src={'/favicon.ico'} alt='' fill />
          </div>
          <div className='relative border border-black rounded-full h-5 w-5 ml-1'>
            <Image src={'/favicon.ico'} alt='' fill />
          </div>
        </div>
        <button className='p-2 mr-4 w-20 rounded-lg border-2 text-sm font-medium border-lore-beige text-lore-blue'>
          Sharing
        </button>
        <button className='p-2 mr-4 w-20 rounded-lg border-2 text-sm font-medium border-lore-red bg-lore-red text-white'>
          Save
        </button>
      </div>
      <div className='flex flex-col bg-white'>
        <h1>name: {entry.name}</h1>
        <div>description: {entry.description}</div>
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
