import { getEntry, getPermissions, getWorld } from '@/lib/db';
import { notFound } from 'next/navigation';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Session, getServerSession } from 'next-auth';
import ClientEntryPage from '@/components/entry/ClientEntryPage';
import { Entry, World } from '@/types';

interface Props {
  params: {
    worldID: string;
    entryID: string;
  };
}

export default async function EntryPage({ params }: Props) {
  const entry = await getEntry(params.worldID, params.entryID);
  const session: Session | null = await getServerSession(authOptions);
  const { world, entries }: { world: World | undefined, entries: Entry[] } = await getWorld(
    params.worldID,
    session?.user?.email as string
  );
  
  if (!entry || !session?.user?.email || !world) {
    notFound();
  }
  const permissions = await getPermissions(params.worldID, session.user.email);

  return (
    <ClientEntryPage
      currentEntry={entry}
      world={world}
      entries={entries}
      permissions={permissions}
      session={session}
    />
  );
}
