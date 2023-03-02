'use client';

import { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Dispatch, SetStateAction, useEffect } from 'react';

type Props = {
  session: Session | null;
  worldName?: string;
  showMenu?: boolean;
  setShowMenu?: Dispatch<SetStateAction<boolean>>;
};

const NavBar = ({ session, worldName, showMenu, setShowMenu }: Props) => {
  const userData = {
    image: session?.user?.image as string,
    email: session?.user?.email as string,
    username: session?.user?.name as string,
  };

  const onSignIn = async () => {
    try {
      await fetch('/api/user/update', {
        method: 'POST',
        body: JSON.stringify({ userData }),
      });
    } catch (error) {
      console.log('error updating user: ', error);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      onSignIn();
    }
  }, [session]);

  return (
    <div className='flex flex-col gap-4 p-4'>
      <div className='flex items-center justify-between min-w-max'>
        <div className='flex items-center h-6 gap-6'>
          <Link className='h-5' href='/'>
            <img src={'/lore-genie-logo.svg'} alt='Lore Genie' />
          </Link>
          {worldName && (
            <h2 className='self-center hidden text-xl font-medium leading-6 md:block text-lore-blue-400'>
              {worldName}
            </h2>
          )}
        </div>
        <div className='flex items-center h-8 gap-2 pl-2 md:gap-4 text-lore-blue-400'>
          {session ? (
            <button className='hidden md:block' onClick={() => signOut()}>
              Sign Out
            </button>
          ) : (
            <button className='hidden md:block' onClick={() => signIn()}>
              Sign In
            </button>
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
      {showMenu && setShowMenu && (
        <button
          className='flex items-center gap-2 text-lore-blue-400 md:hidden w-fit'
          onClick={() => setShowMenu(!showMenu)}
        >
          {showMenu ? (
            <span className='material-icons'>close</span>
          ) : (
            <span className='material-icons'>menu</span>
          )}
          <h2 className='text-xl font-medium leading-6'>{worldName}</h2>
        </button>
      )}
    </div>
  );
};

export default NavBar;
