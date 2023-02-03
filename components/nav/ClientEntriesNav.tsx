'use client';

import { Campaign, Entry } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import NavSearch from './NavSearch';

interface Props {
  children: JSX.Element;
  entries: Entry[];
  campaigns: Campaign[];
  worldID: string;
  permissions: string[];
}

const ClientEntriesNav = ({
  children,
  entries,
  campaigns,
  worldID,
  permissions,
}: Props) => {
  const router = useRouter();

  return (
    <div className='w-full'>
      <div className='flex flex-col justify-between h-full'>
        <NavSearch
          children={children}
          entries={entries}
          campaigns={campaigns}
          worldID={worldID}
        />
        <div className='absolute bottom-20'>
          {permissions.includes('writer') && (
            <div>
              <Link href={`/world/${worldID}/entry/new`}>New Entry</Link>
              <br />
              <Link href={`/world/${worldID}/campaign/new`}>New Campaign</Link>
            </div>
          )}
        </div>
        <div className='flex bg-lore-beige-400'>
          <button
            className='flex items-center justify-center w-full gap-2 px-4 py-3 m-4 text-white transition-all duration-300 ease-out rounded-lg bg-lore-red-400 hover:bg-lore-red-500'
            onClick={() => router.push(`/world/${worldID}/page/generate`)}
          >
            <span className='text-[20px] material-icons'>add</span>
            <div className='text-[16px] font-medium'>Create new page</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientEntriesNav;
