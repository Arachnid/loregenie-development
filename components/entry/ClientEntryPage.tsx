'use client';

import { Category, Entry, EntryHierarchy, World } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import AlertDialog from '@/components/AlertDialog';
import PageHeader from '@/components/PageHeader';
import { createEntryHierarchy } from '@/utils/createEntryHierarchy';
import { getIcon } from '@/utils/getIcon';

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
  const parentDropDownRef = useRef();

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClicks);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClicks);
    };
  }, [parentDropDownOpen]);

  const handleOutsideClicks = (event) => {
    if (
      parentDropDownOpen &&
      parentDropDownRef.current &&
      !parentDropDownRef.current.contains(event.target)
    ) {
      setParentDropDownOpen(false);
    }
  };

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

  const getParents = (entries: Entry[]): EntryHierarchy[] => {
    const result: EntryHierarchy[] = [];
    const parentHierarchy: EntryHierarchy[] = createEntryHierarchy(entries);

    const recursiveEntryHierarchy = (entriesHierarchy: EntryHierarchy[]) => {
      entriesHierarchy.map((entry: EntryHierarchy) => {
        if (
          entry.id !== currentEntry?.id &&
          entry.category === Category.Location
        ) {
          if (entry.children) {
            result.push(entry);
            return recursiveEntryHierarchy(entry.children);
          }
          result.push(entry);
        }
      });
    };
    recursiveEntryHierarchy(parentHierarchy);
    return result;
  };

  return (
    <div className='flex flex-col w-full h-full mb-12'>
      <PageHeader />
      <div className='flex flex-col items-start h-full bg-white py-6 px-16 gap-10 isolate overflow-y-scroll scrollbar-hide'>
        <div className='flex items-start self-stretch gap-6 h-[170px] min-w-max'>
          <div className='flex flex-col grow items-start p-6 gap-4 bg-lore-light-beige rounded-lg'>
            <div className='flex items-center gap-4 self-stretch'>
              <div className='font-medium w-[54px]'>Parent</div>
              <div className='relative flex flex-col items-center gap-4 self-stretch w-full'>
                <button
                  className='flex w-full justify-center items-center h-11 py-3 px-4 gap-2 bg-white rounded-lg cursor-pointer'
                  onClick={() => setParentDropDownOpen(!parentDropDownOpen)}
                >
                  <div className='flex grow'>{parentField}</div>
                  <span className='text-[20px] material-icons'>
                    expand_more
                  </span>
                </button>
                {parentDropDownOpen && (
                  <div ref={parentDropDownRef} className='absolute flex flex-col w-full bg-white border-2 border-lore-beige rounded-lg mt-12 min-w-max shadow-[0px_5px_10px_rgba(0,0,0,0.15)]'>
                    <div className='flex justify-center items-center py-3 px-4 self-stretch border-b-2 border-lore-beige'>
                      <div className='font-light leading-5 grow'>Search</div>
                      <span className='text-[20px] material-icons'>search</span>
                    </div>
                    <div className='flex flex-col p-2 self-stretch grow overflow-y-scroll scrollbar-hide'>
                      <div className='flex flex-col self-stretch grow text-lore-blue'>
                        <button
                          className='flex items-center p-2 gap-2 self-stretch'
                          onClick={() => {
                            setParentField(world.name);
                            setParentDropDownOpen(false);
                          }}
                        >
                          {getIcon(
                            'Home',
                            'material-icons-outlined text-[20px]'
                          )}
                          <div className='flex font-medium leading-5 grow'>
                            {world.name}
                          </div>
                        </button>
                        {getParents(entries).map((entry) => (
                          <button
                            className='flex items-center p-2 gap-2 self-stretch'
                            onClick={() => {
                              setParentField(entry.name);
                              setParentDropDownOpen(false);
                            }}
                          >
                            {getIcon(
                              entry.category,
                              'material-icons-outlined text-[20px]'
                            )}
                            <div className='flex font-medium leading-5 grow'>
                              {entry.name}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className='bg-lore-beige h-[2px] self-stretch' />
            <div className='flex items-center gap-4 self-stretch'>
              <div className='font-medium w-[54px]'>Type</div>
              <div className='flex grow justify-center items-center h-11 py-3 px-4 gap-2 bg-white rounded-lg'>
                <div className='grow'>{currentEntry.category}</div>
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
