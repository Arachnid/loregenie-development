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
      <div className='flex justify-between items-center min-w-max p-4 gap-4 h-16'>
        <div className='flex gap-6 h-6 items-center'>
          <Link className='h-5' href='/'>
            <img src={'/lore-genie-logo.svg'} alt='Lore Genie' />
          </Link>
          {worldName && (
            <h2 className='self-center font-medium text-[20px] leading-6 text-lore-blue-400'>
              {worldName}
            </h2>
          )}
        </div>
        <div className='flex items-center text-lore-blue-400 gap-4 h-8'>
          {session ? (
            <button onClick={() => signOut()}>Sign Out</button>
          ) : (
            <button onClick={() => signIn()}>Sign In</button>
          )}
          <span className='material-icons-outlined'>notifications</span>
          <span className='material-icons-outlined'>settings</span>
          <div className='relative border border-black rounded-full h-8 w-8'>
            <Image src={'/favicon.ico'} alt='' fill />
          </div>
        </div>
    </div>
  );
};

export default NavBar;
