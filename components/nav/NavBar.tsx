'use client';

import { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

type Props = {
  session: Session | null;
};

const NavBar = ({ session }: Props) => {
  return (
    <div className='flex justify-between p-3'>
      <Link className='text-lore-red text-lg' href='/'>
        Lore Genie
      </Link>
      {session ? (
        <button className='' onClick={() => signOut()}>
          Sign Out
        </button>
      ) : (
        <button onClick={() => signIn()}>Sign In</button>
      )}
    </div>
  );
};

export default NavBar;
