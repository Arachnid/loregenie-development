import { getContributors, getPermissions, getWorld } from '@/lib/db';
import { notFound } from 'next/navigation';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Session, getServerSession } from 'next-auth';
import { Campaign, User, World } from '@/types';
import ClientWorldPage from '@/components/pages/ClientWorldPage';

interface Props {
  params: {
    worldID: string;
  };
}

export default async function WorldPage({ params }: Props) {
  const session: Session | null = await getServerSession(authOptions);
  const {
    world,
    campaigns,
  }: {
    world: World | undefined;
    campaigns: Campaign[];
  } = await getWorld(params.worldID, session?.user?.email as string);

  const contributors: User[] = await getContributors(params.worldID);

  if (!world || !session?.user?.email) {
    notFound();
  }
  const permissions = await getPermissions(params.worldID, session.user.email);

  return (
    <>
      <ClientWorldPage
        world={world}
        campaigns={campaigns}
        permissions={permissions}
        session={session}
        contributors={contributors}
      />
    </>
  );
}
