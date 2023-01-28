'use client';

import { World } from '@/types';
import Button from '@mui/material/Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AlertDialog from '../AlertDialog';

type Props = {
  world: World;
  permissions: string[];
};

const WorldPage = ({ world, permissions }: Props) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    try {
      await fetch('/api/world/delete', {
        method: 'POST',
        body: JSON.stringify({ worldID: world.id, permissions }),
      });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.log('error deleting world: ', error);
    }
  };
  return (
    <div className='flex flex-col w-full h-full'>
      <div className='flex justify-end items-center w-full py-2 px-4 bg-white mb-[2px] min-w-max'>
        <div className='flex items-center gap-4 h-11'>
          <div className='flex items-center gap-2 h-8'>
            <img
              className='relative rounded-full h-8 w-8'
              src={'/favicon.ico'}
              alt=''
            />
            <img
              className='relative rounded-full h-8 w-8'
              src={'/favicon.ico'}
              alt=''
            />
            <img
              className='relative rounded-full h-8 w-8'
              src={'/favicon.ico'}
              alt=''
            />
          </div>
          <button className='flex justify-center items-center py-3 px-4 gap-2 h-11 w-[100px] rounded-lg border-2 text-[16px] font-medium border-lore-beige text-lore-blue'>
            Sharing
          </button>
          <button className='flex justify-center items-center py-3 px-4 gap-2 h-11 w-[100px] rounded-lg border-2 text-[16px] font-medium border-lore-red bg-lore-red text-white'>
            Save
          </button>
        </div>
      </div>
      <div className='flex flex-col bg-white'>
        <div className='relative'>
          <Image src={''} alt='' />
        </div>
        <h1>{world.name}</h1>
        <div>{world.description}</div>
        <div>admins: {world.admins.join(', ')}</div>
        <div>writers: {world.writers.join(', ')}</div>
        <div>readers: {world.readers.join(', ')}</div>
        <div>visibility: {world.public ? 'public' : 'private'}</div>
        {permissions.includes('writer') && (
          <Button
            variant='contained'
            sx={{ margin: '8px' }}
            onClick={() => router.push(`/world/${world.id}/edit`)}
          >
            Edit World
          </Button>
        )}
        {permissions.includes('admin') && (
          <Button
            variant='contained'
            color='error'
            sx={{ margin: '8px' }}
            onClick={() => setAlertOpen(true)}
          >
            Delete World
          </Button>
        )}
        {alertOpen && (
          <AlertDialog
            title={'Delete this World?'}
            description={
              'Doing so will permanently delete the data in this world, including all nested entries.'
            }
            confirmText={`Confirm that you want to delete this world by typing in its name:`}
            confirmValue={world.name}
            alertOpen={alertOpen}
            setAlertOpen={setAlertOpen}
            action={onDelete}
          />
        )}
      </div>
    </div>
  );
};

export default WorldPage;
