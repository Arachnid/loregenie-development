'use client';

import { Campaign, Category, Entry, LoreSchemas, World } from '@/types';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import CategoryDropDown from '@/components/CategoryDropDown';
import ParentDropDown from '@/components/ParentDropDown';
import { getIcon } from '@/utils/getIcon';
import { useClientContext } from '@/hooks/useClientContext';

type Props = {
  onCreate: () => Promise<void>;
  world?: World;
  campaigns?: Campaign[];
  entries: Entry[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  form: Entry;
  setForm: Dispatch<SetStateAction<Entry>>;
};

const GenieForm = ({
  onCreate,
  world,
  entries,
  campaigns,
  setOpen,
  form,
  setForm,
}: Props) => {
  const router = useRouter();
  const { client } = useClientContext();

  const everything = [...entries, ...campaigns as Campaign[]];

  return (
    <div className='flex flex-col pt-20 gap-10 w-[640px]'>
      <div className='relative flex flex-col self-stretch gap-8 p-10 isolate bg-lore-beige-400 rounded-2xl'>
        <img
          className='-z-10 absolute w-[389px] h-[524px] -right-8 top-[calc(50%-524px/2-56px)]'
          src='/genie.svg'
          alt=''
        />
        <div className='flex flex-col self-stretch gap-4'>
          {world && (
            <div className='relative z-20 flex self-stretch gap-4'>
              <ParentDropDown
                world={world}
                setData={setForm}
                data={form}
                permissions={['admin', 'writer', 'reader']}
                generate={true}
                arr={everything}
              />
              <CategoryDropDown
                setData={setForm}
                data={form}
                permissions={['admin', 'writer', 'reader']}
                generate={true}
              />
            </div>
          )}
          <div className='flex justify-center items-center py-3 px-5 gap-4 bg-white rounded-[10px] self-stretch'>
            <p className='font-cinzel font-bold text-[27px] leading-9 text-center opacity-50'>
              PROMPT EXAMPLE
            </p>
          </div>
          <button
            className='flex items-center self-stretch justify-center gap-2 px-4 py-3 text-white transition-all duration-300 ease-out rounded-lg bg-lore-red-400 disabled:opacity-50 disabled:hover:bg-lore-red-400 hover:bg-lore-red-500'
            disabled
          >
            <span className='text-[20px] material-icons'>auto_fix_high</span>
            <p className='font-medium leading-5'>Generate</p>
          </button>
        </div>
      </div>
      <div className='flex self-stretch gap-6 px-10 text-lore-blue-400'>
        <button
          className='flex items-center justify-center w-full gap-2 px-4 py-3 transition-all duration-300 ease-out bg-white border-2 rounded-lg border-lore-beige-500 hover:bg-lore-beige-400'
          onClick={setOpen ? () => setOpen(false) : () => router.back()}
        >
          <p className='font-medium leading-5'>Cancel</p>
        </button>
        <button
          className='relative z-0 flex items-center justify-center w-full gap-2 px-4 py-3 transition-all duration-300 ease-out bg-white border-2 rounded-lg border-lore-beige-500 hover:bg-lore-beige-400 disabled:bg-white/50'
          onClick={() => onCreate()}
          disabled={!form.category}
        >
          <span className='text-[20px] material-icons'>add</span>
          <p className='font-medium leading-5'>Create blank</p>
        </button>
      </div>
    </div>
  );
};

export default GenieForm;
