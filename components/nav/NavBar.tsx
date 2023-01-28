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
        <div className='flex gap-6 items-end'>
          <Link href='/'>
            <img src={'/lore-genie-logo.svg'} alt='Lore Genie' />
          </Link>
          {worldName && (
            <div className='flex items-center font-medium text-[20px] text-lore-blue'>
              {worldName}
            </div>
          )}
        </div>
        <div className='flex items-center text-lore-blue gap-4 h-8'>
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
