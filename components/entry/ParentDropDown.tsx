'use client';

import { useClientContext } from '@/hooks/useClientContext';
import { Category, Entry, EntryHierarchy, isEntry, World } from '@/types';
import { createEntryHierarchy } from '@/utils/createEntryHierarchy';
import { getIcon } from '@/utils/getIcon';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import EntriesList from '../nav/EntriesList';

type Props<T> = {
  world: World;
  entries: Entry[];
  setData: Dispatch<SetStateAction<T>>;
  data: T;
  permissions: string[];
  generate?: boolean;
};

const ParentDropDown = <T extends {}>({
  world,
  entries,
  setData,
  data,
  permissions,
  generate,
}: Props<T>) => {
  const [searchValue, setSearchValue] = useState('');
  const [filteredSearch, setFilteredSearch] = useState<EntryHierarchy[]>([]);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const { client } = useClientContext();

  const getParents = (entries: Entry[]): EntryHierarchy[] => {
    const result: EntryHierarchy[] = [];
    const parentHierarchy: EntryHierarchy[] = createEntryHierarchy(entries);

    const recursiveEntryHierarchy = (entriesHierarchy: EntryHierarchy[]) => {
      if (isEntry(data)) {
        entriesHierarchy.map((entry: EntryHierarchy) => {
          if (entry.id !== data.id && entry.category === Category.Location) {
            if (entry.children) {
              result.push(entry);
              return recursiveEntryHierarchy(entry.children);
            }
            result.push(entry);
          }
        });
      }
    };
    recursiveEntryHierarchy(parentHierarchy);
    return result;
  };

  useEffect(() => {
    const filterSearch = getParents(entries).filter((parentEntry) => {
      if (parentEntry.name.toLowerCase().includes(searchValue.toLowerCase())) {
        return parentEntry;
      }
    });
    setFilteredSearch(filterSearch);
  }, [searchValue]);

  return (
    <OutsideClickHandler
      onOutsideClick={() => setDropDownOpen(false)}
      display='contents'
    >
      <div className='relative flex flex-col items-center self-stretch w-full gap-4'>
        <button
          className='flex items-center justify-center w-full gap-2 px-4 py-3 bg-white rounded-lg cursor-pointer h-11 disabled:cursor-default'
          onClick={() => setDropDownOpen(!dropDownOpen)}
          disabled={!permissions.includes('writer')}
        >
          <p className='flex grow'>
            {isEntry(data) &&
              (generate
                ? client.entry.name
                : data.parent
                ? data.parent.name
                : world.name)}
          </p>
          {permissions.includes('writer') &&
            (dropDownOpen ? (
              <span className='text-[20px] material-icons'>expand_less</span>
            ) : (
              <span className='text-[20px] material-icons'>expand_more</span>
            ))}
        </button>
        {dropDownOpen && (
          <div className='z-20 absolute flex flex-col w-full bg-white border-2 border-lore-beige-500 rounded-lg mt-12 min-w-max shadow-[0px_5px_10px_rgba(0,0,0,0.15)]'>
            <div className='flex items-center self-stretch justify-center px-4 py-3 border-b-2 border-lore-beige-500'>
              <input
                className='leading-5 grow placeholder:text-black focus-visible:outline-none'
                placeholder='Search'
                value={searchValue}
                onChange={(event) => setSearchValue(event?.target.value)}
              />
              {searchValue ? (
                <span
                  className='text-[20px] cursor-pointer material-icons'
                  onClick={() => setSearchValue('')}
                >
                  close
                </span>
              ) : (
                <span className='text-[20px] cursor-default material-icons'>
                  search
                </span>
              )}
            </div>
            <div className='flex flex-col self-stretch p-2 overflow-y-scroll grow scrollbar-hide'>
              <div className='flex flex-col self-stretch grow text-lore-blue-400'>
                <button
                  className='flex items-center self-stretch gap-2 p-2 transition-all duration-300 ease-out rounded-lg hover:bg-lore-beige-300'
                  onClick={() => {
                    if (isEntry(data)) {
                      const { parent, ...state } = data;
                      setData(state as T);
                      setDropDownOpen(false);
                    }
                  }}
                >
                  {getIcon('Home', 'material-icons-outlined text-[20px]')}
                  <p className='flex font-medium leading-5 grow'>
                    {world.name}
                  </p>
                </button>
                {/* <EntriesList entries={getParents(entries)} campaigns={[]} world={world} /> */}
                {filteredSearch.map((parentEntry, index) => (
                  <button
                    className='flex items-center self-stretch gap-2 p-2 transition-all duration-300 ease-out rounded-lg hover:bg-lore-beige-300'
                    onClick={() => {
                      if (isEntry(data)) {
                        setData({
                          ...data,
                          parent: {
                            name: parentEntry.name,
                            id: parentEntry.id,
                          },
                        });
                        setDropDownOpen(false);
                      }
                    }}
                    key={index}
                  >
                    {getIcon(
                      parentEntry.category,
                      'material-icons-outlined text-[20px]'
                    )}
                    <p className='flex font-medium leading-5 grow'>
                      {parentEntry.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </OutsideClickHandler>
  );
};

export default ParentDropDown;
