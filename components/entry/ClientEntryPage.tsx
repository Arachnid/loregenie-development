'use client';

import { Entry, World } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import ParentDropDown from '@/components/entry/ParentDropDown';
import CategoryDropDown from '@/components/entry/CategoryDropDown';
import ImageSettings from '@/components/ImageSettings';
import PageBody from '@/components/PageBody';
import { Session } from 'next-auth';

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

  return (
    <div className='flex flex-col w-full h-full mb-12'>
      <PageHeader<Entry>
        session={session}
        data={entryData}
        currentData={currentEntry}
        setData={setEntryData}
        onSave={onSave}
        permissions={permissions}
      />
      <div className='flex flex-col items-start h-full gap-10 px-16 py-6 overflow-y-scroll bg-white isolate scrollbar-hide'>
        <div className='flex items-start self-stretch gap-6 h-[170px] min-w-max'>
          <div className='flex flex-col items-start gap-4 p-6 rounded-lg grow bg-lore-beige-400'>
            <div className='flex items-center self-stretch gap-4'>
              <p className='font-medium w-14'>Parent</p>
              <ParentDropDown
                world={world}
                entries={entries}
                setEntryData={setEntryData}
                entryData={entryData}
                permissions={permissions}
              />
            </div>
            <div className='bg-lore-beige-500 h-[2px] self-stretch' />
            <div className='flex items-center self-stretch gap-4'>
              <p className='font-medium w-14'>Type</p>
              <CategoryDropDown
                setEntryData={setEntryData}
                entryData={entryData}
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
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

export default ClientEntryPage;
