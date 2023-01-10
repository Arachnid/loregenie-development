'use client';

import Button from '@mui/material/Button';
import { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

type Props = {
  session: Session | null;
};

const NavBar = ({ session }: Props) => {
  return (
    <>
      {session ? (
        <>
          <Button onClick={() => signOut()}>Sign Out</Button>
          <Link href='/' style={{ textDecoration: 'none' }}>
            <Button>Home</Button>
          </Link>
        </>
      ) : (
        <Button onClick={() => signIn()}>Sign In</Button>
      )}
    </>
  );
};

export default NavBar;
