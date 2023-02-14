'use client';

import { useClientContext } from '@/hooks/useClientContext';
import {
  Category,
  Entry,
  EntryHierarchy,
  isCampaign,
  isEntry,
  LoreSchemas,
  World,
} from '@/types';
import { createEntryHierarchy } from '@/utils/createEntryHierarchy';
import { getIcon } from '@/utils/getIcon';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import EntriesList from './nav/EntriesList';

type Props<T extends LoreSchemas> = {
  world: World;
  setData: Dispatch<SetStateAction<Entry>>;
  data: Entry;
  permissions: string[];
  generate?: boolean;
  arr: T[];
};

const ParentDropDown = <T extends LoreSchemas>({
  world,
  setData,
  data,
  permissions,
  generate,
  arr,
}: Props<T>) => {
  const [searchValue, setSearchValue] = useState('');
  const [filteredSearch, setFilteredSearch] = useState<T[]>([]);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const { client } = useClientContext();

  const filterSearch = () => {
    return arr.filter((el) => {
      if (el.name.toLowerCase().includes(searchValue.toLowerCase())) {
        return el;
      }
    });
  };

  useEffect(() => {
    setFilteredSearch(filterSearch);
  }, [searchValue]);

  return (
    <OutsideClickHandler
      onOutsideClick={() => setDropDownOpen(false)}
      display='contents'
    >
      <div className='relative z-10 flex flex-col items-center self-stretch w-full gap-4'>
        <button
          className='flex items-center justify-center w-full gap-2 px-4 py-3 bg-white rounded-lg cursor-pointer h-11 disabled:cursor-default'
          onClick={() => setDropDownOpen(!dropDownOpen)}
          disabled={!permissions.includes('writer')}
        >
          <p className='flex grow'>
            {generate
              ? data.campaign
                ? data.campaign.name
                : data.parent
                ? data.parent.name
                : world.name
              : world.name}
          </p>
          {permissions.includes('writer') &&
            (dropDownOpen ? (
              <span className='text-[20px] material-icons'>expand_less</span>
            ) : (
              <span className='text-[20px] material-icons'>expand_more</span>
            ))}
        </button>
        {dropDownOpen && (
          <div className='absolute flex flex-col w-full bg-white border-2 border-lore-beige-500 rounded-lg mt-12 min-w-max shadow-[0px_5px_10px_rgba(0,0,0,0.15)] max-h-80'>
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
                    const { parent, campaign, category, ...state } = data;
                    setData(state);
                    setDropDownOpen(false);
                  }}
                >
                  {getIcon('Home', 'material-icons-outlined text-[20px]')}
                  <p className='flex font-medium leading-5 grow'>
                    {world.name}
                  </p>
                </button>
                {/* <EntriesList entries={getParents(entries)} campaigns={[]} world={world} /> */}
                {filteredSearch.map((el, index) => (
                  <button
                    className='flex items-center self-stretch gap-2 p-2 transition-all duration-300 ease-out rounded-lg hover:bg-lore-beige-300'
                    onClick={() => {
                      if (isEntry(el)) {
                        const { campaign, category, ...state } = data;
                        setData({
                          ...state,
                          parent: {
                            name: el.name,
                            id: el.id,
                          },
                        });
                      } else if (isCampaign(el)) {
                        const { parent, category, ...state } = data;
                        setData({
                          ...state,
                          campaign: { id: el.id, name: el.name },
                        });
                      } else {
                        const { parent, category, ...state } = data;
                        setData(state);
                      }
                      setDropDownOpen(false);
                    }}
                    key={index}
                  >
                    {getIcon(
                      isEntry(el)
                        ? el.category
                          ? el.category
                          : ''
                        : 'Campaign',
                      'material-icons-outlined text-[20px]'
                    )}
                    <p className='flex font-medium leading-5 grow'>{el.name}</p>
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
