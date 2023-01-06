'use client';

import { NPC } from '@/types';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Props = {
  npcs: NPC[];
  worldID: string;
};

const NPCList = ({ npcs, worldID }: Props) => {
  const router = useRouter();
  return (
    <>
      <h2>NPCs</h2>
      <List>
        {npcs.map((npc: NPC, index) => {
          return (
            <ListItem key={index}>
              <Link href={`/world/${worldID}/npc/${npc.id}`}>
                {npc.name}
              </Link>
            </ListItem>
          );
        })}
      </List>
      <Button onClick={() => router.push(`world/${worldID}/npc/new`)}>
        Create NPC
      </Button>
    </>
  );
};

export default NPCList;
