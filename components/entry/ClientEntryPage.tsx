'use client';

import { Entry, World } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import AlertDialog from '@/components/AlertDialog';
import PageHeader from '@/components/PageHeader';

interface Props {
  entry: Entry;
  world: World;
  permissions: string[];
}

const ClientEntryPage = ({ entry, world, permissions }: Props) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    try {
      await fetch('/api/entry/delete', {
        method: 'POST',
        body: JSON.stringify({
          entryID: entry.id,
          worldID: world.id,
          permissions,
        }),
      });
      router.push(`/world/${world.id}`);
      router.refresh();
    } catch (error) {
      console.log('error deleting entry: ', error);
    }
  };

  return (
    <div className='flex flex-col w-full h-full mb-12'>
      <PageHeader />
      <div className='flex flex-col items-start h-full bg-white py-6 px-16 gap-10 isolate overflow-y-scroll scrollbar-hide'>
        <div className='flex items-start self-stretch gap-6 h-[170px] min-w-max'>
          <div className='flex flex-col grow items-start p-6 gap-4 bg-lore-light-beige rounded-lg'>
            <div className='flex items-center gap-4 self-stretch'>
              <div className='font-medium w-[54px]'>Parent</div>
              <div className='flex grow justify-center items-center h-11 py-3 px-4 gap-2 bg-white rounded-lg'>
                <div className='grow'>
                  {entry.parent?.name ? entry.parent.name : world.name}
                </div>
                <span className='text-[20px] material-icons'>expand_more</span>
              </div>
            </div>
            <div className='bg-lore-beige h-[2px] self-stretch' />
            <div className='flex items-center gap-4 self-stretch'>
              <div className='font-medium w-[54px]'>Type</div>
              <div className='flex grow justify-center items-center h-11 py-3 px-4 gap-2 bg-white rounded-lg'>
                <div className='grow'>{entry.category}</div>
                <span className='text-[20px] material-icons'>expand_more</span>
              </div>
            </div>
          </div>
          <div className='relative w-[170px] h-full rounded-lg'>
            <div className='flex justify-center items-center p-3 gap-2 absolute w-11 h-11 right-2 bottom-2 bg-lore-red rounded-full'>
              <span className='text-[20px] text-white material-icons'>
                more_vert
              </span>
            </div>
            <img className='w-full h-full' src='/drogon.svg' alt='' />
          </div>
        </div>
        <h1 className='text-[40px] font-bold'>{entry.name}</h1>
        <ReactMarkdown className='markdown'>{entry.description}</ReactMarkdown>
        {permissions.includes('writer') && (
          <button
            onClick={() =>
              router.push(`/world/${world.id}/entry/${entry.id}/edit`)
            }
          >
            Edit {entry.category}
          </button>
        )}
        {permissions.includes('admin') && (
          <button onClick={() => setAlertOpen(true)}>
            Delete {entry.category}
          </button>
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
