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
  const email = session?.user?.email;
  const world: World | undefined = await getWorld(
    params.worldID,
    email as string
  );

  if (!email || !world) {
    notFound();
  }

  const permissions = await getPermissions(email, world.id);

  return (
    <>
      <BaseLayout
        nav={
          <EntriesNav
            worldID={params.worldID}
            email={session?.user?.email as string}
            permissions={permissions}
            world={world}
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
