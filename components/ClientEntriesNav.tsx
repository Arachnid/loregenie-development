'use client';

import Link from 'next/link';

interface Props {
  children: JSX.Element;
  worldID: string;
}

const ClientEntriesNav = ({ children, worldID }: Props) => {
  return (
    <>
      {children}
      <Link href={`/world/${worldID}/entry/new`}>New Page</Link>
    </>
  );
};

export default ClientEntriesNav;
