import { getPermissions, getWorld } from '@/lib/db';
import { notFound } from 'next/navigation';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Session, unstable_getServerSession } from 'next-auth';
import { World } from '@/types';
import ClientWorldPage from '@/components/world/ClientWorldPage';

interface Props {
  params: {
    worldID: string;
  };
}

export default async function WorldPage({ params }: Props) {
  const session: Session | null = await unstable_getServerSession(authOptions);
  const {
    world,
  }: {
    world: World | undefined;
  } = await getWorld(params.worldID);

  if (!world || !session?.user?.email) {
    notFound();
  }
  const permissions = await getPermissions(params.worldID, session.user.email);

  return (
    <>
      <ClientWorldPage world={world} permissions={permissions} />
    </>
  );
}
