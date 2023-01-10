import { getWorld } from '@/lib/db';
import ClientEntriesNav from '@/components/ClientEntriesNav';
import { Entry, World } from '@/types';
import EntriesList from '@/components/EntriesList';
import { notFound } from 'next/navigation';

interface Props {
  worldID: string;
}

export default async function EntriesNav({ worldID }: Props) {
  const { world, entries }: { world: World | undefined; entries: Entry[] } =
    await getWorld(worldID);

  if (!world) {
    notFound();
  }
  
  return (
    <ClientEntriesNav worldID={worldID}>
      <EntriesList entries={entries} world={world} />
    </ClientEntriesNav>
  );
}
