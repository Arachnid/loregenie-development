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
    <div className='flex justify-between px-3 py-2 min-w-max'>
      <div className='flex'>
        <Link className='relative w-40 mt-1' href='/'>
          <Image src={'/lore-genie-logo.svg'} alt='Lore Genie' fill />
        </Link>
        {worldName && (
          <div className='flex items-center ml-6 font-medium text-lore-blue'>
            {worldName}
          </div>
        )}
      </div>
      <div className='flex items-center text-lore-blue'>
        <span className='material-icons-outlined m-2'>notifications</span>
        <span className='material-icons-outlined m-2'>settings</span>
        <div className='relative border border-black rounded-full h-5 w-5 m-2'>
          <Image src={'/favicon.ico'} alt='' fill />
        </div>
        {session ? (
          <button className='m-1' onClick={() => signOut()}>
            Sign Out
          </button>
        ) : (
          <button className='m-1' onClick={() => signIn()}>
            Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default NavBar;
