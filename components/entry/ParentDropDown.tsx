'use client';

import { useOutsideClick } from '@/hooks/useOutsideClick';
import { Category, Entry, EntryHierarchy, World } from '@/types';
import { createEntryHierarchy } from '@/utils/createEntryHierarchy';
import { getIcon } from '@/utils/getIcon';
import { Dispatch, RefObject, SetStateAction } from 'react';

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
      className='absolute flex flex-col w-full bg-white border-2 border-lore-beige rounded-lg mt-12 min-w-max shadow-[0px_5px_10px_rgba(0,0,0,0.15)]'
      ref={parentDropDownRef}
    >
      <div className='flex justify-center items-center py-3 px-4 self-stretch border-b-2 border-lore-beige'>
        <p className='font-light leading-5 grow'>Search</p>
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
            {getIcon('Home', 'material-icons-outlined text-[20px]')}
            <p className='flex font-medium leading-5 grow'>{world.name}</p>
          </button>
          {getParents(entries).map((entry) => (
            <button
              className='flex items-center p-2 gap-2 self-stretch'
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
