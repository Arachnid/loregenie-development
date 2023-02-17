import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Inter } from '@next/font/google';
import HomePage from '@/components/HomePage';
import { getWorlds } from '@/lib/db';
import NavBar from '@/components/nav/NavBar';
import { World } from '@/types';

const inter = Inter({ subsets: ['latin'] });

export default async function Home() {
  const session = await getServerSession(authOptions);
  let worlds: World[] = [];

  if (session?.user?.email) {
    worlds = await getWorlds(session?.user?.email);
  }

  return (
    <div className='flex flex-col h-screen'>
      <NavBar session={session} />
      <HomePage worlds={worlds} session={session} />
    </div>
  );
}
