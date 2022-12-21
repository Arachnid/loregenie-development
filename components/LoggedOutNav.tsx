'use client';

import Button from '@mui/material/Button';
import { signIn } from 'next-auth/react';

export default function LoggedOutNav() {
    return (
        <Button onClick={() => signIn()}>Sign In</Button>
    )
}
