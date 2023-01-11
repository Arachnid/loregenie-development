import EntryForm from '@/components/entry/EntryForm';
import { getPermissions, getWorld } from '@/lib/db';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Entry, World } from '@/types';
import { unstable_getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    worldID: string;
  };
}

export default async function NewEntryPage({ params }: Props) {
  const session = await unstable_getServerSession(authOptions);
  const { world, entries }: { world: World | undefined; entries: Entry[] } =
    await getWorld(params.worldID);
  if (!session?.user?.email || !world) {
    notFound();
  }
  const permissions = await getPermissions(params.worldID, session.user.email);

  return (
    <>
      <h1>Create New Entry</h1>
      <EntryForm world={world} entries={entries} permissions={permissions} />
    </>
  );
}
