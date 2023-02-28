'use client';

import {
  Campaign,
  Category,
  Entry,
  EntryHierarchy,
  LoreSchemas,
  World,
} from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import ParentDropDown from '@/components/dropdown/ParentDropDown';
import ImageSettings from '@/components/ImageSettings';
import PageBody from '@/components/PageBody';
import { Session } from 'next-auth';
import { useClientContext } from '@/hooks/useClientContext';
import { createEntryHierarchy } from '@/utils/createEntryHierarchy';
import { base64Converter } from '@/utils/base64Converter';

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
          campaignID: currentEntry.campaign?.id,
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
        }),
      });
      router.refresh();
    } catch (error) {
      console.log('error updating entry: ', error);
    }
  };

  const onImageUpload = async (uploadedFile: File) => {
    try {
      const base64: string = await base64Converter(uploadedFile);
      const filePath = `worlds/${world.id}/entries/${currentEntry.id}/image`;
      await fetch('/api/image/create', {
        method: 'POST',
        body: JSON.stringify({ base64, filePath, worldID: world.id }),
      }).then((res) =>
        res
          .json()
          .then((url: string) => setEntryData({ ...entryData, image: url }))
      );
      router.refresh();
    } catch (error) {
      console.log('error submitting image: ', error);
    }
  };

  const getParents = (entries: Entry[]): EntryHierarchy[] => {
    const result: EntryHierarchy[] = [];
    const parentHierarchy: EntryHierarchy[] = createEntryHierarchy(entries);

    const recursiveEntryHierarchy = (entriesHierarchy: EntryHierarchy[]) => {
      entriesHierarchy.map((entry: EntryHierarchy) => {
        if (
          entry.id !== currentEntry.id &&
          (entry.category === Category.Location ||
            entry.category === Category.Journal)
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

  const defaultParent = () => {
    if (currentEntry.parent) {
      return currentEntry.parent.name;
    }
    if (currentEntry.campaign) {
      return currentEntry.campaign.name;
    }
    return world.name;
  };

  const generateDropDownList = () => {
    const result: LoreSchemas[] = [];
    if (currentEntry.campaign) {
      result.push(currentEntry.campaign as Campaign);
    } else {
      result.push(world);
    }
    result.push(...getParents(entries));
    return result;
  };

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
      <div className='flex flex-col items-start h-full gap-6 p-4 overflow-y-scroll bg-white md:gap-10 md:px-16 md:py-6 isolate scrollbar-hide'>
        <div className='flex flex-col-reverse items-start self-stretch gap-6 md:flex-row'>
          <div className='flex flex-col items-start w-full gap-4 p-6 rounded-lg md:w-auto md:grow bg-lore-beige-400'>
            <div className='flex items-center self-stretch gap-4'>
              <p className='font-medium w-[54px]'>Parent</p>
              <ParentDropDown<LoreSchemas>
                setData={setEntryData}
                data={entryData}
                permissions={permissions}
                dropDownList={generateDropDownList()}
                defaultParent={defaultParent()}
              />
            </div>
            <div className='bg-lore-beige-500 h-[2px] self-stretch' />
            <div className='flex items-center self-stretch gap-4'>
              <p className='w-[54px] font-medium'>Type</p>
              <div className='flex items-center gap-2 px-4 py-3 bg-white rounded-lg grow h-11'>
                {entryData.category}
              </div>
            </div>
          </div>
          <div className={`relative flex w-full ${!entryData.image && 'pb-[100%] xs:pb-[440px]'} xs:w-[440px] xs:mx-auto md:min-h-0 md:pb-0 md:w-[170px] md:h-[170px] rounded-lg bg-lore-beige-400`}>
            <div className='absolute flex bottom-2 right-2'>
              <ImageSettings<Entry>
                data={entryData}
                setData={setEntryData}
                permissions={permissions}
                onUpload={onImageUpload}
              />
            </div>
            {entryData.image && (
              <img
                className='object-cover w-full h-full rounded-lg aspect-square'
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
