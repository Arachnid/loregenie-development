import { getEntry, getWorld } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Entry, World } from '@/types';
import EntryForm from '@/components/entry/EntryForm';

interface Props {
  params: {
    worldID: string;
    entryID: string;
  };
}

export default async function EditLocationPage({ params }: Props) {
  const { world, entries }: { world: World | undefined; entries: Entry[] } =
    await getWorld(params.worldID);
  const currentEntry = await getEntry(params.worldID, params.entryID);
  if (!currentEntry || !world) {
    notFound();
  }
  return (
    <>
      <h1>Edit Entry</h1>
      <EntryForm currentEntry={currentEntry} world={world} entries={entries} />
    </>
  );
}
