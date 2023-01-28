'use client';

import { ReactNode } from 'react';
import NavBar from '@/components/nav/NavBar';
import { Session } from 'next-auth';

interface Props {
  nav: JSX.Element;
  session: Session;
  worldName: string;
  children: ReactNode;
}

export default function BaseLayout({
  nav,
  session,
  worldName,
  children,
}: Props) {
  return (
    <div className='flex flex-col h-screen overflow-hidden'>
      <NavBar session={session} worldName={worldName} />
      <div className='flex h-full'>
        <div className='flex max-w-fit w-full min-w-[320px]'>
          <nav className='flex w-full'>{nav}</nav>
        </div>
        <div className='flex w-full ml-[2px]'>{children}</div>
      </div>
    </div>
  );
}
