'use client';

import { Category, isEntry } from '@/types';
import { getIcon } from '@/utils/getIcon';
import { Dispatch, SetStateAction, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

type Props<T> = {
  setData: Dispatch<SetStateAction<T>>;
  data: T;
  permissions: string[];
  children?: JSX.Element;
};

const CategoryDropDown = <T extends {}>({
  setData,
  data,
  permissions,
  children,
}: Props<T>) => {
  const [dropDownOpen, setDropDownOpen] = useState(false);

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
            {isEntry(data) && (data.category ? data.category : 'Select one')}
          </p>
          {permissions.includes('writer') &&
            (dropDownOpen ? (
              <span className='text-[20px] material-icons'>expand_less</span>
            ) : (
              <span className='text-[20px] material-icons'>expand_more</span>
            ))}
        </button>
        {dropDownOpen && (
          <div className='z-10 absolute flex flex-col w-full bg-white border-2 border-lore-beige-500 rounded-lg mt-12 min-w-max shadow-[0px_5px_10px_rgba(0,0,0,0.15)]'>
            <div className='flex flex-col self-stretch p-2 overflow-y-scroll grow scrollbar-hide'>
              <div className='flex flex-col self-stretch grow text-lore-blue-400'>
                {children ? (
                  children
                ) : (
                  <>
                  <button
                      className='flex items-center self-stretch gap-2 p-2 transition-all duration-300 ease-out rounded-lg hover:bg-lore-beige-300'
                      onClick={() => {
                        setData({ ...data, category: Category.Location });
                        setDropDownOpen(false);
                      }}
                    >
                      {getIcon(
                        Category.Location,
                        'material-icons-outlined text-[20px]'
                      )}
                      <p className='flex font-medium leading-5 grow'>
                        {Category.Location}
                      </p>
                    </button>
                    <button
                      className='flex items-center self-stretch gap-2 p-2 transition-all duration-300 ease-out rounded-lg hover:bg-lore-beige-300'
                      onClick={() => {
                        setData({ ...data, category: Category.NPC });
                        setDropDownOpen(false);
                      }}
                    >
                      {getIcon(
                        Category.NPC,
                        'material-icons-outlined text-[20px]'
                      )}
                      <p className='flex font-medium leading-5 grow'>
                        {Category.NPC}
                      </p>
                    </button>
                    <button
                      className='flex items-center self-stretch gap-2 p-2 transition-all duration-300 ease-out rounded-lg hover:bg-lore-beige-300'
                      onClick={() => {
                        setData({ ...data, category: Category.Lore });
                        setDropDownOpen(false);
                      }}
                    >
                      {getIcon(
                        Category.Lore,
                        'material-icons-outlined text-[20px]'
                      )}
                      <p className='flex font-medium leading-5 grow'>
                        {Category.Lore}
                      </p>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </OutsideClickHandler>
  );
};

export default CategoryDropDown;
