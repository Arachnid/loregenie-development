import { getPermissions, getWorld } from '@/lib/db';
import ClientEntriesNav from '@/components/nav/ClientEntriesNav';
import { World } from '@/types';
import EntriesList from '@/components/nav/EntriesList';
import { notFound } from 'next/navigation';

interface Props {
  worldID: string;
  email: string;
}

export default async function EntriesNav({ worldID, email }: Props) {
  const world: World | undefined =
    await getWorld(worldID, email);

  if (!world) {
    notFound();
  }
  const permissions = await getPermissions(worldID, email);

  return (
    <ClientEntriesNav
      worldID={worldID}
      permissions={permissions}
      entries={world.entries}
      campaigns={world.campaigns}
    >
      <EntriesList entries={world.entries} campaigns={world.campaigns} world={world} />
    </ClientEntriesNav>
  );
}
