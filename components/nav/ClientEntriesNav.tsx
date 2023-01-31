'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Props {
  children: JSX.Element;
  worldID: string;
  permissions: string[];
}

const ClientEntriesNav = ({ children, worldID, permissions }: Props) => {
  const router = useRouter();

  return (
    <div className='w-full'>
      <div className='flex flex-col h-full justify-between'>
        <div className='flex justify-between items-center bg-white px-4 py-[18px] mb-[2px] text-lore-blue'>
          <div>Search</div>
          <span className='material-icons-outlined'>search</span>
        </div>
        <div className='bg-lore-light-beige p-4 gap-4 overflow-y-scroll scrollbar-hide h-full'>
          {children}
        </div>
        <div className='absolute bottom-20'>
          {permissions.includes('writer') && (
            <div>
              <Link href={`/world/${worldID}/entry/new`}>New Entry</Link>
              <br />
              <Link href={`/world/${worldID}/campaign/new`}>New Campaign</Link>
            </div>
          )}
        </div>
        <div className='flex bg-lore-light-beige'>
          <button className='flex justify-center items-center text-white w-full py-3 px-4 m-4 gap-2 rounded-lg bg-lore-red' onClick={() => router.push(`/world/${worldID}/page/generate`)}>
            <span className='text-[20px] material-icons'>add</span>
            <div className='text-[16px] font-medium'>Create new page</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientEntriesNav;
