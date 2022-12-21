import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import BaseLayout from '@/components/BaseLayout';
import UserNav from '@/components/UserNav';
import LoggedOutNav from '@/components/LoggedOutNav';
import { ReactNode } from 'react';

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await unstable_getServerSession(authOptions);
  const nav = session?.user ? <UserNav session={session} /> : <LoggedOutNav />;
  return (
    <html lang="en">
      <head />
      <body>
        <BaseLayout nav={nav}>{children}</BaseLayout>
      </body>
    </html>
  )
}
