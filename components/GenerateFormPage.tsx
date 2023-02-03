'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

type Props = {
  worldID: string;
  permissions: string[];
};

const blankPage = {
  name: '',
  description: '',
  image: '',
  public: false,
};

const GenerateFormPage = ({ worldID, permissions }: Props) => {
  const router = useRouter();

  return (
    <div className='flex flex-col items-center justify-center gap-10 px-16 py-6 overflow-y-scroll bg-white grow isolate scrollbar-hide'>
      <div className='flex flex-col pt-20 gap-10 w-[640px]'>
        <div className='relative flex flex-col self-stretch gap-8 p-10 isolate bg-lore-beige-400 rounded-2xl'>
          <img
            className='-z-10 absolute w-[389px] h-[524px] -right-8 top-[calc(50%-524px/2-56px)]'
            src='/genie.svg'
            alt=''
          />
          <div className='flex flex-col self-stretch gap-4'>
            <div className='flex self-stretch gap-4'>
              <div className='flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-lg grow'>
                <p className='leading-5 grow'>Eryndor</p>
                <span className='text-[20px] material-icons'>expand_more</span>
              </div>
              <div className='flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-lg grow'>
                <p className='leading-5 grow'>Select a type</p>
                <span className='text-[20px] material-icons'>expand_more</span>
              </div>
            </div>
            <div className='flex justify-center items-center py-3 px-5 gap-4 bg-white rounded-[10px] self-stretch'>
              <p className='font-cinzel font-bold text-[27px] leading-9 text-center opacity-50'>
                PROMPT EXAMPLE
              </p>
            </div>
            <button className='flex items-center self-stretch justify-center gap-2 px-4 py-3 text-white transition-all duration-300 ease-out rounded-lg bg-lore-red-400 disabled:opacity-50 disabled:hover:bg-lore-red-400 hover:bg-lore-red-500' disabled>
              <span className='text-[20px] material-icons'>auto_fix_high</span>
              <p className='font-medium leading-5'>Generate</p>
            </button>
          </div>
        </div>
        <div className='flex self-stretch gap-6 px-10 text-lore-blue-400'>
          <button className='z-10 flex items-center justify-center w-full gap-2 px-4 py-3 transition-all duration-300 ease-out bg-white border-2 rounded-lg border-lore-beige-500 hover:bg-lore-beige-400' onClick={() => router.back()}>
            <p className='font-medium leading-5'>Cancel</p>
          </button>
          <button className='z-10 flex items-center justify-center w-full gap-2 px-4 py-3 transition-all duration-300 ease-out bg-white border-2 rounded-lg border-lore-beige-500 hover:bg-lore-beige-400'>
            <span className='text-[20px] material-icons'>add</span>
            <p
              className='font-medium leading-5'
              onClick={() => router.push(`/world/${worldID}/page/blank`)}
            >
              Create blank page
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateFormPage;
