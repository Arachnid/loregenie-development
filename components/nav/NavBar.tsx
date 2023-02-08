'use client';

import { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  session: Session | null;
  worldName?: string;
};

const NavBar = ({ session, worldName }: Props) => {
  return (
    <div className='flex items-center justify-between h-16 gap-4 p-4 min-w-max'>
      <div className='flex items-center h-6 gap-6'>
        <Link className='h-5' href='/'>
          <img src={'/lore-genie-logo.svg'} alt='Lore Genie' />
        </Link>
        {worldName && (
          <h2 className='self-center font-medium text-[20px] leading-6 text-lore-blue-400'>
            {worldName}
          </h2>
        )}
      </div>
      <div className='flex items-center h-8 gap-4 text-lore-blue-400'>
        {session ? (
          <button onClick={() => signOut()}>Sign Out</button>
        ) : (
          <button onClick={() => signIn()}>Sign In</button>
        )}
        <span className='material-icons-outlined'>notifications</span>
        <span className='material-icons-outlined'>settings</span>
        <img
          className='w-8 h-8 rounded-full'
          src={
            session?.user?.image
              ? session.user.image
              : '/no-profile-picture.svg'
          }
          alt=''
        />
      </div>
    </div>
  );
};

export default NavBar;
