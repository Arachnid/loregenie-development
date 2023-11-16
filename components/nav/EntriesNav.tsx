"use-client"

import { getPermissions, getWorld } from '@/lib/db';
import ClientEntriesNav from '@/components/nav/ClientEntriesNav';
import { World } from '@/types';
import EntriesList from '@/components/nav/EntriesList';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Props {
  worldID: string;
  email: string;
}

export default function EntriesNav({ worldID, email }: Props) {
  const [world, setWorld] = useState<World | undefined>(undefined);
  const [permissions, setPermissions] = useState<any>();


    useEffect(() => {
      async function fetchData() {
        const fetchedWorld = await getWorld(worldID, email);
        if (!fetchedWorld) {
          notFound();
        } else {
          setWorld(fetchedWorld);
          const fetchedPermissions = await getPermissions(email, worldID);
          setPermissions(fetchedPermissions);
        }
      }
  
      fetchData();
    }, [worldID, email]);
  
    if (!world || !permissions) {
      // Render loading state or null
      notFound();
    }

  // if (!world) {
  //   notFound();
  // }
  // const permissions = await getPermissions(email, worldID);

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
