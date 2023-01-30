import { getEntry, getPermissions, getWorld } from '@/lib/db';
import { notFound } from 'next/navigation';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Session, unstable_getServerSession } from 'next-auth';
import ClientEntryPage from '@/components/entry/ClientEntryPage';
import { World } from '@/types';

interface Props {
  params: {
    worldID: string;
    entryID: string;
  };
}

export default async function EntryPage({ params }: Props) {
  const entry = await getEntry(params.worldID, params.entryID);
  const session: Session | null = await unstable_getServerSession(authOptions);
  const { world }: { world: World | undefined } = await getWorld(
    params.worldID,
    session?.user?.email as string
  );
  
  if (!entry || !session?.user?.email || !world) {
    notFound();
  }
  const permissions = await getPermissions(params.worldID, session.user.email);

  return (
    <ClientEntryPage
      entry={entry}
      world={world}
      permissions={permissions}
    />
  );
}
