'use client';

import { Category, Entry, isCampaign, isEntry, LoreSchemas } from '@/types';
import { getIcon } from '@/utils/getIcon';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { filterLogic } from './filterLogic';

type Props<T extends LoreSchemas> = {
  setData: Dispatch<SetStateAction<Entry>>;
  data: Entry;
  permissions: string[];
  generate?: boolean;
  dropDownList: T[];
  defaultParent: string;
};

const ParentDropDown = <T extends LoreSchemas>({
  setData,
  data,
  permissions,
  generate,
  dropDownList,
  defaultParent,
}: Props<T>) => {
  const [searchValue, setSearchValue] = useState('');
  const [filteredSearch, setFilteredSearch] = useState<T[]>([]);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [parentDisplay, setParentDisplay] = useState(defaultParent);

  const filterSearch = () => {
    return dropDownList.filter((listIem) => {
      if (listIem.name.toLowerCase().includes(searchValue.toLowerCase())) {
        return listIem;
      }
    });
  };

  const handleIcon = (schema: LoreSchemas): JSX.Element => {
    const classString = 'material-icons-outlined text-[20px]';
    if (isEntry(schema)) {
      return getIcon(schema.category as Category, classString);
    }
    if (isCampaign(schema)) {
      return getIcon('Campaign', classString);
    }
    return getIcon('Home', classString);
  };

  useEffect(() => {
    setFilteredSearch(filterSearch);
  }, [searchValue]);

  return (
    <OutsideClickHandler
      onOutsideClick={() => setDropDownOpen(false)}
      display='contents'
    >
      <div className='relative flex flex-col items-center self-stretch w-full gap-4 grow'>
        <button
          className='flex items-center justify-center w-full gap-2 px-4 py-3 bg-white rounded-lg cursor-pointer h-11 disabled:cursor-default'
          onClick={() => setDropDownOpen(!dropDownOpen)}
          disabled={!permissions.includes('writer')}
        >
          <p className='flex grow'>{parentDisplay}</p>
          {permissions.includes('writer') &&
            (dropDownOpen ? (
              <span className='text-[20px] material-icons'>expand_less</span>
            ) : (
              <span className='text-[20px] material-icons'>expand_more</span>
            ))}
        </button>
        {dropDownOpen && (
          <div className='z-10 absolute flex flex-col w-full bg-white border-2 border-lore-beige-500 rounded-lg mt-12 min-w-max shadow-[0px_5px_10px_rgba(0,0,0,0.15)] max-h-80'>
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
                {filteredSearch.map((schema: any, index) => (
                  <button
                    className='flex items-center self-stretch gap-2 p-2 transition-all duration-300 ease-out rounded-lg hover:bg-lore-beige-300'
                    onClick={() => {
                      filterLogic(generate, schema, data, setData);
                      setParentDisplay(() => schema.name);
                      setDropDownOpen(false);
                    }}
                    key={index}
                  >
                    {handleIcon(schema)}
                    <p className='flex font-medium leading-5 grow'>
                      {schema.name}
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
