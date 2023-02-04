'use client';

import { useOutsideClick } from '@/hooks/useOutsideClick';
import { Category, Entry } from '@/types';
import { getIcon } from '@/utils/getIcon';
import { Dispatch, RefObject, SetStateAction } from 'react';

type Props = {
  setCategoryDropDownOpen: Dispatch<SetStateAction<boolean>>;
  setEntryData: Dispatch<SetStateAction<Entry>>;
  entryData: Entry;
};

const CategoryDropDown = ({
  setCategoryDropDownOpen,
  setEntryData,
  entryData,
}: Props) => {
  const parentDropDownRef: RefObject<HTMLDivElement> =
    useOutsideClick<HTMLDivElement>(() => setCategoryDropDownOpen(false));

  return (
    <div
      className='z-10 absolute flex flex-col w-full bg-white border-2 border-lore-beige-500 rounded-lg mt-12 min-w-max shadow-[0px_5px_10px_rgba(0,0,0,0.15)]'
      ref={parentDropDownRef}
    >
      <div className='flex flex-col self-stretch p-2 overflow-y-scroll grow scrollbar-hide'>
        <div className='flex flex-col self-stretch grow text-lore-blue-400'>
          <button
            className='flex items-center self-stretch gap-2 p-2 transition-all duration-300 ease-out rounded-lg hover:bg-lore-beige-300'
            onClick={() => {
              setEntryData({ ...entryData, category: Category.Location });
              setCategoryDropDownOpen(false);
            }}
          >
            {getIcon(Category.Location, 'material-icons-outlined text-[20px]')}
            <p className='flex font-medium leading-5 grow'>
              {Category.Location}
            </p>
          </button>
          <button
            className='flex items-center self-stretch gap-2 p-2 transition-all duration-300 ease-out rounded-lg hover:bg-lore-beige-300'
            onClick={() => {
              setEntryData({ ...entryData, category: Category.NPC });
              setCategoryDropDownOpen(false);
            }}
          >
            {getIcon(Category.NPC, 'material-icons-outlined text-[20px]')}
            <p className='flex font-medium leading-5 grow'>{Category.NPC}</p>
          </button>
          <button
            className='flex items-center self-stretch gap-2 p-2 transition-all duration-300 ease-out rounded-lg hover:bg-lore-beige-300'
            onClick={() => {
              setEntryData({ ...entryData, category: Category.Lore });
              setCategoryDropDownOpen(false);
            }}
          >
            {getIcon(Category.Lore, 'material-icons-outlined text-[20px]')}
            <p className='flex font-medium leading-5 grow'>{Category.Lore}</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryDropDown;
