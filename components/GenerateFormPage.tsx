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
    <div className='flex flex-col grow justify-center items-center bg-white py-6 px-16 gap-10 isolate overflow-y-scroll scrollbar-hide'>
      <div className='flex flex-col pt-20 gap-10 w-[640px]'>
        <div className='relative flex flex-col p-10 gap-8 isolate bg-lore-light-beige rounded-2xl self-stretch'>
          <img
            className='-z-10 absolute w-[389px] h-[524px] -right-8 top-[calc(50%-524px/2-56px)]'
            src='/genie.svg'
            alt=''
          />
          <div className='flex flex-col gap-4 self-stretch'>
            <div className='flex gap-4 self-stretch'>
              <div className='flex justify-center items-center py-3 px-4 gap-2 bg-white rounded-lg grow'>
                <div className='font-light leading-5 grow'>Eryndor</div>
                <span className='text-[20px] material-icons'>expand_more</span>
              </div>
              <div className='flex justify-center items-center py-3 px-4 gap-2 bg-white rounded-lg grow'>
                <div className='font-light leading-5 grow'>Select a type</div>
                <span className='text-[20px] material-icons'>expand_more</span>
              </div>
            </div>
            <div className='flex justify-center items-center py-3 px-5 gap-4 bg-white rounded-[10px] self-stretch'>
              <div className='font-cinzel font-bold text-[27px] leading-9 text-center opacity-50'>
                PROMPT EXAMPLE
              </div>
            </div>
            <button className='flex justify-center items-center py-3 px-4 gap-2 bg-lore-red text-white opacity-50 rounded-lg self-stretch'>
              <span className='text-[20px] material-icons'>auto_fix_high</span>
              <div className='font-medium leading-5'>Generate</div>
            </button>
          </div>
        </div>
        <div className='flex px-10 gap-6 self-stretch text-lore-blue'>
          <button className='z-10 flex justify-center items-center py-3 px-4 gap-2 bg-white border-2 rounded-lg border-lore-beige w-full'>
            <div className='font-medium leading-5'>Cancel</div>
          </button>
          <button className='z-10 flex justify-center items-center py-3 px-4 gap-2 bg-white border-2 rounded-lg border-lore-beige w-full'>
            <span className='text-[20px] material-icons'>add</span>
            <div
              className='font-medium leading-5'
              onClick={() => router.push(`/world/${worldID}/page/blank`)}
            >
              Create blank page
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateFormPage;
