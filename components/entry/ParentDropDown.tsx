'use client';

import { useOutsideClick } from '@/hooks/useOutsideClick';
import { Category, Entry, EntryHierarchy, World } from '@/types';
import { createEntryHierarchy } from '@/utils/createEntryHierarchy';
import { getIcon } from '@/utils/getIcon';
import { Dispatch, RefObject, SetStateAction } from 'react';
import EntriesList from '../nav/EntriesList';

type Props = {
  world: World;
  entries: Entry[];
  currentEntry: Entry;
  setParentDropDownOpen: Dispatch<SetStateAction<boolean>>;
  setParentField: Dispatch<SetStateAction<string>>;
};

const ParentDropDown = ({
  world,
  entries,
  currentEntry,
  setParentDropDownOpen,
  setParentField,
}: Props) => {
  const parentDropDownRef: RefObject<HTMLDivElement> =
    useOutsideClick<HTMLDivElement>(() => setParentDropDownOpen(false));

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
    <div
      className='absolute flex flex-col w-full bg-white border-2 border-lore-beige-500 rounded-lg mt-12 min-w-max shadow-[0px_5px_10px_rgba(0,0,0,0.15)]'
      ref={parentDropDownRef}
    >
      <div className='flex items-center self-stretch justify-center px-4 py-3 border-b-2 border-lore-beige-500'>
        <p className='font-light leading-5 grow'>Search</p>
        <span className='text-[20px] material-icons'>search</span>
      </div>
      <div className='flex flex-col self-stretch p-2 overflow-y-scroll grow scrollbar-hide'>
        <div className='flex flex-col self-stretch grow text-lore-blue-400'>
          <button
            className='flex items-center self-stretch gap-2 p-2 transition-all duration-300 ease-out rounded-lg hover:bg-lore-beige-300'
            onClick={() => {
              setParentField(world.name);
              setParentDropDownOpen(false);
            }}
          >
            {getIcon('Home', 'material-icons-outlined text-[20px]')}
            <p className='flex font-medium leading-5 grow'>{world.name}</p>
          </button>
          {/* <EntriesList entries={getParents(entries)} campaigns={[]} world={world} /> */}
          {getParents(entries).map((entry) => (
            <button
              className='flex items-center self-stretch gap-2 p-2 transition-all duration-300 ease-out rounded-lg hover:bg-lore-beige-300'
              onClick={() => {
                setParentField(entry.name);
                setParentDropDownOpen(false);
              }}
            >
              {getIcon(entry.category, 'material-icons-outlined text-[20px]')}
              <p className='flex font-medium leading-5 grow'>{entry.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParentDropDown;
