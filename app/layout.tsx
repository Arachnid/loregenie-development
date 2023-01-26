import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { ReactNode } from 'react';
import NavBar from '@/components/nav/NavBar';
import './/globals.css';

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await unstable_getServerSession(authOptions);
  return (
    <html lang="en">
      <head />
      <body className='flex flex-col w-full h-screen bg-lore-beige tracking-wide'>
        <NavBar session={session} />
        {children}
      </body>
    </html>
  )
}
