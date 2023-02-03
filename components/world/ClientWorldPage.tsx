'use client';

import { World } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AlertDialog from '@/components/AlertDialog';
import PageHeader from '@/components/PageHeader';
import ReactMarkdown from 'react-markdown';

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
    <div className='flex flex-col w-full h-full mb-12'>
      <PageHeader />
      <div className='flex flex-col items-start gap-10 px-16 py-6 overflow-y-scroll bg-white grow isolate scrollbar-hide'>
        <div className='relative min-h-[352px] max-h-[352px] w-full rounded-2xl'>
          <img
            className='object-cover w-full h-full rounded-lg'
            src='/eryndor.svg'
            alt=''
          />
          <button className='absolute flex items-center justify-center gap-2 p-3 transition-all duration-300 ease-out rounded-full w-11 h-11 right-4 bottom-4 bg-lore-red-400 hover:bg-lore-red-500'>
            <span className='text-[20px] text-white material-icons'>
              more_vert
            </span>
          </button>
        </div>
        <h1 className='text-[40px] font-bold'>{world.name}</h1>
        <ReactMarkdown>{world.description}</ReactMarkdown>
        {permissions.includes('writer') && (
          <button onClick={() => router.push(`/world/${world.id}/edit`)}>
            Edit World
          </button>
        )}
        {permissions.includes('admin') && (
          <button onClick={() => setAlertOpen(true)}>Delete World</button>
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
