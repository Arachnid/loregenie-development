'use client';

import { ReactNode } from 'react';
import NavBar from '@/components/nav/NavBar';
import { Session } from 'next-auth';
import { ClientProvider } from '@/context/ClientContext';
import GenieWand from './GenieWand';

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
    <ClientProvider>
      <div className='flex flex-col h-screen overflow-x-hidden'>
        <NavBar session={session} worldName={worldName} />
        <div className='flex h-full overflow-y-hidden'>
          <div className='flex max-w-fit w-full lg:min-w-[320px]'>
            <nav className='flex w-full'>{nav}</nav>
          </div>
          <div className='flex w-full ml-[2px]'>{children}</div>
          <div className='absolute z-20 bottom-4 right-4'>
            <GenieWand />
          </div>
        </div>
      </div>
    </ClientProvider>
  );
}
