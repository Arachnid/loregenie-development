'use client';

import { Entry, World } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import AlertDialog from '@/components/AlertDialog';
import PageHeader from '@/components/PageHeader';
import ParentDropDown from './ParentDropDown';

interface Props {
  currentEntry: Entry;
  world: World;
  entries: Entry[];
  permissions: string[];
}

const ClientEntryPage = ({
  currentEntry,
  world,
  entries,
  permissions,
}: Props) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [parentDropDownOpen, setParentDropDownOpen] = useState(false);
  const [parentField, setParentField] = useState(
    currentEntry.parent?.name ? currentEntry.parent.name : world.name
  );
  const router = useRouter();

  const onDelete = async () => {
    try {
      await fetch('/api/entry/delete', {
        method: 'POST',
        body: JSON.stringify({
          entryID: currentEntry.id,
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
      <div className='flex flex-col items-start h-full gap-10 px-16 py-6 overflow-y-scroll bg-white isolate scrollbar-hide'>
        <div className='flex items-start self-stretch gap-6 h-[170px] min-w-max'>
          <div className='flex flex-col items-start gap-4 p-6 rounded-lg grow bg-lore-beige-400'>
            <div className='flex items-center self-stretch gap-4'>
              <p className='font-medium w-[54px]'>Parent</p>
              <div className='relative flex flex-col items-center self-stretch w-full gap-4'>
                <button
                  className='flex items-center justify-center w-full gap-2 px-4 py-3 bg-white rounded-lg cursor-pointer h-11'
                  onClick={() => setParentDropDownOpen(!parentDropDownOpen)}
                >
                  <p className='flex grow'>{parentField}</p>
                  <span className='text-[20px] material-icons'>
                    expand_more
                  </span>
                </button>
                {parentDropDownOpen && (
                  <ParentDropDown
                    {...{
                      world,
                      entries,
                      currentEntry,
                      setParentDropDownOpen,
                      setParentField,
                    }}
                  />
                )}
              </div>
            </div>
            <div className='bg-lore-beige-500 h-[2px] self-stretch' />
            <div className='flex items-center self-stretch gap-4'>
              <p className='font-medium w-[54px]'>Type</p>
              <div className='flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-lg grow h-11'>
                <p className='grow'>{currentEntry.category}</p>
                <span className='text-[20px] material-icons'>expand_more</span>
              </div>
            </div>
          </div>
          <div className='relative w-[170px] h-full rounded-lg'>
            <button className='absolute flex items-center justify-center gap-2 p-3 transition-all duration-300 ease-out rounded-full w-11 h-11 right-2 bottom-2 bg-lore-red-400 hover:bg-lore-red-500'>
              <span className='text-[20px] text-white material-icons'>
                more_vert
              </span>
            </button>
            <img className='w-full h-full' src='/drogon.svg' alt='' />
          </div>
        </div>
        <h1 className='text-[40px] font-bold'>{currentEntry.name}</h1>
        <ReactMarkdown className='markdown'>
          {currentEntry.description}
        </ReactMarkdown>
        {permissions.includes('writer') && (
          <button
            onClick={() =>
              router.push(`/world/${world.id}/entry/${currentEntry.id}/edit`)
            }
          >
            Edit {currentEntry.category}
          </button>
        )}
        {permissions.includes('admin') && (
          <button onClick={() => setAlertOpen(true)}>
            Delete {currentEntry.category}
          </button>
        )}
        {alertOpen && (
          <AlertDialog
            title={`Delete ${currentEntry.name}?`}
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
