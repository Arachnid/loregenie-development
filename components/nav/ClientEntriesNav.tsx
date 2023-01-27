'use client';

import Link from 'next/link';

interface Props {
  children: JSX.Element;
  worldID: string;
  permissions: string[];
}

const ClientEntriesNav = ({ children, worldID, permissions }: Props) => {
  return (
    <div className='flex justify-between flex-col h-full w-full'>
      <div className='flex justify-between items-center bg-white px-4 py-[18px] mb-[2px] text-lore-blue'>
        <div>Search</div>
        <span className='material-icons-outlined'>search</span>
      </div>
      <div className='flex flex-col justify-between h-full bg-lore-light-beige'>
        <div className='p-4 gap-4'>{children}</div>
        {permissions.includes('writer') && (
          <div>
            <Link href={`/world/${worldID}/entry/new`}>New Entry</Link>
            <br />
            <Link href={`/world/${worldID}/campaign/new`}>New Campaign</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientEntriesNav;
