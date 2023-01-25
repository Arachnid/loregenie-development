'use client';

import Link from 'next/link';

interface Props {
  children: JSX.Element;
  worldID: string;
  permissions: string[];
}

const ClientEntriesNav = ({ children, worldID, permissions }: Props) => {
  return (
    <>
      {children}
      {permissions.includes('writer') && (
        <>
          <Link href={`/world/${worldID}/entry/new`}>New Entry</Link>
          <br />
          <Link href={`/world/${worldID}/campaign/new`}>New Campaign</Link>
        </>
      )}
    </>
  );
};

export default ClientEntriesNav;
