'use client';

import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';

type Props = {
  onCreate: (prompt?: string) => Promise<void>;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  children?: JSX.Element;
  disabled: boolean;
};

const GenieForm = ({ onCreate, setOpen, children, disabled }: Props) => {
  const router = useRouter();
  const [ prompt, setPrompt ] = useState('');

  return (
    <div className='relative flex flex-col w-full pt-20 gap-4 md:gap-10 md:w-[640px] min-w-max'>
      <div className='relative flex flex-col self-stretch gap-6 p-6 md:gap-8 md:p-10 isolate bg-lore-beige-400 rounded-2xl'>
        <img
          className='absolute w-[320px] left-[calc(50%-320px/2)] top-[-166px] md:left-auto md:w-[389px] md:h-[524px] md:-right-8 md:top-[calc(50%-524px/2-56px)]'
          src='/genie.svg'
          alt=''
        />
        <div className='z-20 flex flex-col self-stretch gap-4 rounded-2xl'>
          {children}
          <div className='flex justify-center items-center py-3 px-5 gap-4 bg-white rounded-[10px] self-stretch'>
            <input className='font-cinzel font-bold text-[27px] leading-9 text-center opacity-50' placeholder="PROMPT EXAMPLE" type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          </div>
          <button
            className='flex items-center self-stretch justify-center gap-2 px-4 py-3 text-white transition-all duration-300 ease-out rounded-lg bg-lore-red-400 disabled:opacity-50 disabled:hover:bg-lore-red-400 hover:bg-lore-red-500'
            disabled={prompt.length === 0}
            onClick={() => onCreate(prompt)}
          >
            <span className='text-[20px] material-icons'>auto_fix_high</span>
            <p className='font-medium leading-5'>
              {children ? 'Generate' : 'Generate world'}
            </p>
          </button>
        </div>
      <div className='absolute bottom-[-80px] md:bottom-[-100px] p-4 left-0 flex w-full gap-2 md:px-10 md:gap-6 text-lore-blue-400'>
        <button
          className='flex items-center justify-center w-full gap-2 px-3 py-3 transition-all duration-300 ease-out bg-white border-2 rounded-lg md:px-4 border-lore-beige-500 hover:bg-lore-beige-400'
          onClick={setOpen ? () => setOpen(false) : () => router.back()}
        >
          <p className='font-medium leading-5'>Cancel</p>
        </button>
        <button
          className='flex items-center justify-center w-full gap-2 px-4 py-3 transition-all duration-300 ease-out bg-white border-2 rounded-lg border-lore-beige-500 hover:bg-lore-beige-400 disabled:bg-white/50'
          onClick={() => onCreate()}
          disabled={disabled}
        >
          <span className='text-[20px] material-icons'>add</span>
          <p className='font-medium leading-5'>Create blank</p>
        </button>
      </div>
      </div>
    </div>
  );
};

export default GenieForm;
