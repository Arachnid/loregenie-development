import { getPermissions, getWorld } from '@/lib/db';
import ClientEntriesNav from '@/components/ClientEntriesNav';
import { Entry, World } from '@/types';
import EntriesList from '@/components/EntriesList';
import { notFound } from 'next/navigation';

interface Props {
  worldID: string;
  email: string;
}

export default async function EntriesNav({ worldID, email }: Props) {
  const { world, entries }: { world: World | undefined; entries: Entry[] } =
    await getWorld(worldID, email);

  if (!world) {
    notFound();
  }
  const permissions = await getPermissions(worldID, email);

  return (
    <ClientEntriesNav worldID={worldID} permissions={permissions}>
      <EntriesList entries={entries} world={world} />
    </ClientEntriesNav>
  );
}
