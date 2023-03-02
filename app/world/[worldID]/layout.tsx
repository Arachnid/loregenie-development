import BaseLayout from '@/components/BaseLayout';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import EntriesNav from '@/components/nav/EntriesNav';
import { notFound } from 'next/navigation';
import { getPermissions, getWorld } from '@/lib/db';
import { World } from '@/types';

interface Props {
  children: JSX.Element;
  params: {
    worldID: string;
  };
}

export default async function Layout({ children, params }: Props) {
  const session = await getServerSession(authOptions);
  const world: World | undefined = await getWorld(
    params.worldID,
    session?.user?.email as string
  );
  if (!session?.user?.email || !world) {
    notFound();
  }

  const permissions = await getPermissions(world.id, session.user.email);

  return (
    <>
      <BaseLayout
        nav={
          <EntriesNav
            worldID={params.worldID}
            email={session?.user?.email as string}
          />
        }
        session={session}
        worldName={world.name}
        permissions={permissions}
      >
        {children}
      </BaseLayout>
    </>
  );
}
