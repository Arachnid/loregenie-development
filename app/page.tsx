import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Inter } from '@next/font/google';
import HomePage from '@/components/HomePage';
import { getWorlds } from '@/lib/db';
import { World } from '@/types';

const inter = Inter({ subsets: ['latin'] });

export default async function Home() {
  const session = await unstable_getServerSession(authOptions);
  let worlds: World[] = [];

  if (session?.user?.email) {
    worlds = await getWorlds(session?.user?.email as string);
  }

  return <HomePage worlds={worlds} />;
}
