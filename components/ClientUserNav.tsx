'use client';

import { Button } from '@mui/material';
import { signOut } from 'next-auth/react';

const ClientUserNav = ({children}: {children: JSX.Element}) => {
  return (
    <>
      <Button onClick={() => signOut()}>Sign Out</Button>
      {children}
    </>
  );
};

export default ClientUserNav;
