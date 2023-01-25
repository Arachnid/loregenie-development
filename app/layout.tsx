import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { ReactNode } from 'react';
import NavBar from '@/components/nav/NavBar';

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await unstable_getServerSession(authOptions);
  
  return (
    <html lang="en">
      <head />
      <body>
        <NavBar session={session} />
        {children}
      </body>
    </html>
  )
}
