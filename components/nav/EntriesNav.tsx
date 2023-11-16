// EntriesNav.server.js (or similar naming convention)
import { getPermissions, getWorld } from '@/lib/db';
import ClientEntriesNav from '@/components/nav/ClientEntriesNav';
import { World } from '@/types';
import EntriesList from '@/components/nav/EntriesList';
import { notFound } from 'next/navigation';

export default function EntriesNav({ worldID, email }: any) {
  let world: World | undefined | any;
  let permissions: any;

  try {
    world = getWorld(worldID, email);
    if (!world) {
      throw new Error('World not found');
    }
    permissions = getPermissions(email, worldID);
  } catch (error) {
    // Handle error
    console.error(error);
    return <div>Error loading data</div>; // or use notFound() as per your app's logic
  }

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
