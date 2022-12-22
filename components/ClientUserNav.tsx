'use client';

import Button from '@mui/material/Button';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const ClientUserNav = ({children}: {children: JSX.Element}) => {
  const router = useRouter();
  return (
    <>
      <Button onClick={() => signOut()}>Sign Out</Button>
      <Button onClick={() => router.push('/')}>Home</Button>
      {children}
    </>
  );
};

export default ClientUserNav;
