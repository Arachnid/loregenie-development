'use client';

import { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

type Props = {
  title: string;
  adminAction: () => void;
  writerAction: () => void;
  readerAction: () => void;
};

const PermissionDropDown = ({
  title,
  adminAction,
  writerAction,
  readerAction,
}: Props) => {
  const [dropDownOpen, setDropDownOpen] = useState(false);

  return (
    <OutsideClickHandler
      onOutsideClick={() => setDropDownOpen(false)}
      display='contents'
    >
      <div className='flex flex-col w-[140px] relative text-lore-blue-400'>
        <button
          className='flex justify-center gap-2 px-4 py-3 bg-white rounded-lg'
          onClick={() => setDropDownOpen(!dropDownOpen)}
        >
          <p className='flex leading-5 grow'>{title}</p>
          {dropDownOpen ? (
            <span className='text-[20px] material-icons'>expand_less</span>
          ) : (
            <span className='text-[20px] material-icons'>expand_more</span>
          )}
        </button>
        {dropDownOpen && (
          <div className='z-30 absolute flex flex-col w-full bg-white border-2 border-lore-beige-500 rounded-lg mt-12 min-w-max shadow-[0px_5px_10px_rgba(0,0,0,0.15)]'>
            {title !== 'Admin' && (
              <button
                className='flex px-4 py-3 leading-5 transition-all duration-300 ease-out rounded-lg hover:bg-lore-beige-300'
                onClick={() => {
                  adminAction();
                  setDropDownOpen(false);
                }}
                id='contributor'
              >
                Admin
              </button>
            )}
            {title !== 'Writer' && (
              <button
                className='flex px-4 py-3 leading-5 transition-all duration-300 ease-out rounded-lg hover:bg-lore-beige-300'
                onClick={() => {
                  writerAction();
                  setDropDownOpen(false);
                }}
                id='contributor'
              >
                Writer
              </button>
            )}
            {title !== 'Reader' && (
              <button
                className='flex px-4 py-3 leading-5 transition-all duration-300 ease-out rounded-lg hover:bg-lore-beige-300'
                onClick={() => {
                  readerAction();
                  setDropDownOpen(false);
                }}
                id='contributor'
              >
                Reader
              </button>
            )}
          </div>
        )}
      </div>
    </OutsideClickHandler>
  );
};

export default PermissionDropDown;
