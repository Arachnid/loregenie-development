'use client';

import Link from 'next/link';

interface Props {
  children: JSX.Element;
  worldID: string;
  permissions: string[];
}

const ClientEntriesNav = ({ children, worldID, permissions }: Props) => {
  return (
    <div className='flex flex-col h-full w-full'>
      <div className='flex justify-between items-center bg-white p-4 mb-[3px] text-lore-blue font-light'>
        <div>Search</div>
        <span className='material-icons-outlined'>search</span>
      </div>
      <div className='flex flex-col justify-between h-full bg-lore-light-beige'>
        <div className='m-2'>{children}</div>
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
