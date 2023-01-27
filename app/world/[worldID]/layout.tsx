import BaseLayout from '@/components/BaseLayout';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import EntriesNav from '@/components/nav/EntriesNav';
import { notFound } from 'next/navigation';
import NavBar from '@/components/nav/NavBar';
import { getWorld } from '@/lib/db';
import { World } from '@/types';

interface Props {
  children: JSX.Element;
  params: {
    worldID: string;
  };
}

export default async function Layout({ children, params }: Props) {
  const session = await unstable_getServerSession(authOptions);
  if (!session?.user?.email) {
    notFound();
  }
  const { world }: { world: World | undefined } = await getWorld(
    params.worldID,
    session?.user.email
  );

  return (
    <>
      <NavBar session={session} worldName={world?.name} />
      <BaseLayout
        nav={
          <EntriesNav
            worldID={params.worldID}
            email={session?.user?.email as string}
          />
        }
      >
        {children}
      </BaseLayout>
    </>
  );
}
