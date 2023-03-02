import { getPermissions, getWorld } from '@/lib/db';
import { notFound } from 'next/navigation';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Session, getServerSession } from 'next-auth';
import ClientWorldPage from '@/components/pages/ClientWorldPage';

interface Props {
  params: {
    worldID: string;
  };
}

export default async function WorldPage({ params }: Props) {
  const session: Session | null = await getServerSession(authOptions);
  const world = await getWorld(params.worldID, session?.user?.email as string);

  if (!world || !session?.user?.email) {
    notFound();
  }
  const permissions = await getPermissions(params.worldID, session.user.email);

  return (
    <>
      <ClientWorldPage
        world={world}
        campaigns={world.campaigns}
        permissions={permissions}
        session={session}
        contributors={world.contributors}
      />
    </>
  );
}
