import { getPermissions, getWorld } from '@/lib/db';
import ClientEntriesNav from '@/components/nav/ClientEntriesNav';
import { Campaign, Entry, World } from '@/types';
import EntriesList from '@/components/nav/EntriesList';
import { notFound } from 'next/navigation';

interface Props {
  worldID: string;
  email: string;
}

export default async function EntriesNav({ worldID, email }: Props) {
  const {
    world,
    entries,
    campaigns,
  }: { world: World | undefined; entries: Entry[]; campaigns: Campaign[] } =
    await getWorld(worldID, email);

  if (!world) {
    notFound();
  }
  const permissions = await getPermissions(worldID, email);

  return (
    <ClientEntriesNav
      worldID={worldID}
      permissions={permissions}
      entries={entries}
      campaigns={campaigns}
    >
      <EntriesList entries={entries} campaigns={campaigns} world={world} />
    </ClientEntriesNav>
  );
}
