import { getEntry, getPermissions, getWorld } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Entry, World } from '@/types';
import EntryForm from '@/components/entry/EntryForm';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

interface Props {
  params: {
    worldID: string;
    entryID: string;
  };
}

export default async function EditLocationPage({ params }: Props) {
  const currentEntry = await getEntry(params.worldID, params.entryID);
  const session: Session | null = await getServerSession(authOptions);
  const { world, entries }: { world: World | undefined; entries: Entry[] } =
    await getWorld(params.worldID, session?.user?.email as string);
  if (!currentEntry || !world || !session?.user?.email) {
    notFound();
  }
  const permissions = await getPermissions(params.worldID, session.user.email);
  return (
    <>
      <h1>Edit Entry</h1>
      <EntryForm
        currentEntry={currentEntry}
        world={world}
        entries={entries}
        permissions={permissions}
      />
    </>
  );
}
