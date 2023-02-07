'use client';

import { useOutsideClick } from '@/hooks/useOutsideClick';
import { Campaign, World } from '@/types';
import { Dispatch, RefObject, SetStateAction, useState } from 'react';

type Props<T extends World | Campaign> = {
  email: string;
  title: string;
  data: T;
  setData: Dispatch<SetStateAction<T>>;
};

const Contributor = <T extends World | Campaign>({
  email,
  title,
  data,
  setData,
}: Props<T>) => {
  const [dropDownOpen, setDropDownOpen] = useState(false);

  const dropDownRef: RefObject<HTMLDivElement> =
    useOutsideClick<HTMLDivElement>(() => setDropDownOpen(false));

  return (
    <div className='flex items-center self-stretch gap-2'>
      <div className='flex items-center p-[10px] pr-4 gap-2 bg-white rounded-lg grow'>
        <img className='w-6 h-6 rounded-full' src='/favicon.ico' alt='' />
        <p className='leading-5 grow'>{email}</p>
      </div>
      <div className='flex flex-col w-[140px] relative text-lore-blue-400'>
        <button
          className='flex justify-center gap-2 px-4 py-3 bg-white rounded-lg'
          onClick={() => setDropDownOpen(!dropDownOpen)}
        >
          <p className='flex leading-5 grow'>{title}</p>
          <span className='text-[20px] material-icons'>expand_more</span>
        </button>
        {dropDownOpen && (
          <div
            className='z-10 absolute flex flex-col w-full bg-white border-2 border-lore-beige-500 rounded-lg mt-12 min-w-max shadow-[0px_5px_10px_rgba(0,0,0,0.15)]'
            ref={dropDownRef}
          >
            {title !== 'Admin' && (
              <button
                className='flex px-4 py-3 leading-5 transition-all duration-300 ease-out rounded-lg hover:bg-lore-beige-300'
                onClick={() => {
                  setData({
                    ...data,
                    admins: [...new Set([...data.admins, email])],
                    writers: [...new Set([...data.writers, email])],
                    readers: [...new Set([...data.readers, email])],
                  });
                  setDropDownOpen(false);
                }}
              >
                Admin
              </button>
            )}
            {title !== 'Writer' && (
              <button
                className='flex px-4 py-3 leading-5 transition-all duration-300 ease-out rounded-lg hover:bg-lore-beige-300'
                onClick={() => {
                  setData({
                    ...data,
                    admins: data.admins.filter((admin) => email !== admin),
                    writers: [...new Set([...data.writers, email])],
                    readers: [...new Set([...data.readers, email])],
                  });
                  setDropDownOpen(false);
                }}
              >
                Writer
              </button>
            )}
            {title !== 'Reader' && (
              <button
                className='flex px-4 py-3 leading-5 transition-all duration-300 ease-out rounded-lg hover:bg-lore-beige-300'
                onClick={() => {
                  setData({
                    ...data,
                    admins: data.admins.filter((admin) => email !== admin),
                    writers: data.writers.filter((writer) => email !== writer),
                    readers: [...new Set([...data.readers, email])],
                  });
                  setDropDownOpen(false);
                }}
              >
                Reader
              </button>
            )}
          </div>
        )}
      </div>
      <span
        className='text-[20px] material-icons text-lore-blue-400 cursor-pointer'
        onClick={() => {
          setData({
            ...data,
            admins: data.admins.filter((admin) => email !== admin),
            writers: data.writers.filter((writer) => email !== writer),
            readers: data.readers.filter((reader) => email !== reader),
          });
        }}
      >
        close
      </span>
    </div>
  );
};

export default Contributor;
