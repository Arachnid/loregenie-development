'use client';

import { useState } from 'react';

type Props = {};

const GenieWand = (props: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      {!open && (
        <button
          className='flex items-center justify-center gap-2 p-4 text-white rounded-full bg-lore-blue-200'
          onClick={() => setOpen(true)}
        >
          <span className='text-[40px] material-icons'>auto_fix_high</span>
        </button>
      )}
      {open && (
        <div className='flex items-center justify-center gap-2 p-2 pr-4 rounded-full bg-lore-blue-200'>
          <div className='flex items-center self-stretch gap-4 px-5 py-4 text-xl font-semibold leading-6 bg-white rounded-full font-cinzel grow'>
            <input
              className='focus-visible:outline-none grow'
              type='text'
              placeholder='PROMPT ENTRY'
            />
            <span className='material-icons text-lore-blue-200'>
              auto_fix_high
            </span>
          </div>
          <button className='flex text-white' onClick={() => setOpen(false)}>
            <span className='material-icons text-[40px]'>close</span>
          </button>
        </div>
      )}
    </>
  );
};

export default GenieWand;
