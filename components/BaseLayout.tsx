'use client';

import { ReactNode, useEffect, useState } from 'react';
import NavBar from '@/components/nav/NavBar';
import { Session } from 'next-auth';
import { ClientProvider } from '@/context/ClientContext';
import GenieWand from '@/components/GenieWand';
import { usePathname } from 'next/navigation';
import ChatModal from './ChatModal';

interface Props {
  nav: JSX.Element;
  session: Session;
  worldName: string;
  permissions: string[];
  children: ReactNode;
}

export default function BaseLayout({
  nav,
  session,
  worldName,
  permissions,
  children,
}: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const pathname = usePathname();
  console.log({session})
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
          <div className='md:flex w-full md:ml-[2px]' hidden={showMenu}>
            {children}
          </div>
          {permissions.includes('writer') && (
            <div className='flex' hidden={showMenu}>
              {/* <GenieWand /> */}
              <ChatModal user={session.user}/>
            </div>
          )}
        </div>
      </div>
    </ClientProvider>
  );
}
