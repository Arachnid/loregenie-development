'use client';

import { Category, Entry, EntryHierarchy, LoreSchemas, World } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import ParentDropDown from '@/components/ParentDropDown';
import CategoryDropDown from '@/components/CategoryDropDown';
import ImageSettings from '@/components/ImageSettings';
import PageBody from '@/components/PageBody';
import { Session } from 'next-auth';
import { useClientContext } from '@/hooks/useClientContext';
import { createEntryHierarchy } from '@/utils/createEntryHierarchy';

interface Props {
  currentEntry: Entry;
  world: World;
  entries: Entry[];
  permissions: string[];
  session: Session;
}

const ClientEntryPage = ({
  currentEntry,
  world,
  entries,
  permissions,
  session,
}: Props) => {
  const [entryData, setEntryData] = useState<Entry>(currentEntry);
  const { setClient } = useClientContext();
  const router = useRouter();

  useEffect(() => {
    setClient({ world, entry: currentEntry });
  }, [currentEntry]);

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

  const onSave = async () => {
    try {
      await fetch('/api/entry/update', {
        method: 'POST',
        body: JSON.stringify({
          entryData,
          worldID: world.id,
          permissions,
        }),
      });
      router.refresh();
    } catch (error) {
      console.log('error updating entry: ', error);
    }
  };

  const getParents = (entries: Entry[]): EntryHierarchy[] => {
    const result: EntryHierarchy[] = [];
    const parentHierarchy: EntryHierarchy[] = createEntryHierarchy(entries);

    const recursiveEntryHierarchy = (entriesHierarchy: EntryHierarchy[]) => {
      entriesHierarchy.map((entry: EntryHierarchy) => {
        if (entry.id !== currentEntry.id && entry.category === Category.Location) {
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

  // const filterSearch = getParents(entries).filter((parentEntry) => {
  //   if (parentEntry.name.toLowerCase().includes(searchValue.toLowerCase())) {
  //     return parentEntry;
  //   }
  // });

  return (
    <div className='flex flex-col w-full h-full mb-12'>
      <PageHeader<Entry>
        session={session}
        data={entryData}
        currentData={currentEntry}
        setData={setEntryData}
        onSave={onSave}
        onDelete={onDelete}
        permissions={permissions}
      />
      <div className='flex flex-col items-start h-full gap-10 px-16 py-6 overflow-y-scroll bg-white isolate scrollbar-hide'>
        <div className='flex items-start self-stretch gap-6 h-[170px] min-w-max'>
          <div className='flex flex-col items-start gap-4 p-6 rounded-lg grow bg-lore-beige-400'>
            <div className='flex items-center self-stretch gap-4'>
              <p className='font-medium w-14'>Parent</p>
              <ParentDropDown<LoreSchemas>
                world={world}
                setData={setEntryData}
                data={entryData}
                permissions={permissions}
                arr={[...getParents(entries), world]}
              />
            </div>
            <div className='bg-lore-beige-500 h-[2px] self-stretch' />
            <div className='flex items-center self-stretch gap-4'>
              <p className='font-medium w-14'>Type</p>
              <CategoryDropDown
                setData={setEntryData}
                data={entryData}
                permissions={permissions}
              />
            </div>
          </div>
          <div className='relative w-[170px] h-full rounded-lg bg-lore-beige-400'>
            <div className='absolute flex bottom-2 right-2'>
              <ImageSettings<Entry>
                data={entryData}
                setData={setEntryData}
                permissions={permissions}
              />
            </div>
            {entryData.image && (
              <img
                className='object-cover w-full h-full rounded-lg'
                src={entryData.image}
                alt=''
              />
            )}
          </div>
        </div>
        <PageBody<Entry>
          data={entryData}
          setData={setEntryData}
          permissions={permissions}
        />
      </div>
    </div>
  );
};

export default ClientEntryPage;
