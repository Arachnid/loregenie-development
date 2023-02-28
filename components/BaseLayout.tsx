'use client';

import { ReactNode, useEffect, useState } from 'react';
import NavBar from '@/components/nav/NavBar';
import { Session } from 'next-auth';
import { ClientProvider } from '@/context/ClientContext';
import GenieWand from '@/components/GenieWand';
import { usePathname } from 'next/navigation';

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
  const [showMenu, setShowMenu] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setShowMenu(false);
  }, [pathname]);
  
  return (
    <ClientProvider>
      <div className='flex flex-col h-screen min-w-fit'>
        <NavBar
          session={session}
          worldName={worldName}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
        />
        <div className='flex h-full overflow-y-hidden'>
          <div
            className='md:flex md:max-w-fit w-full lg:min-w-[320px]'
            hidden={!showMenu}
          >
            <nav className='flex w-full h-full'>{nav}</nav>
          </div>
          <div className='md:flex w-full ml-[2px]' hidden={showMenu}>
            {children}
          </div>
          <div className='absolute z-20 bottom-4 right-4' hidden={showMenu}>
            <GenieWand />
          </div>
        </div>
      </div>
    </ClientProvider>
  );
}
