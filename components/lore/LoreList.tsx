'use client';

import { Lore } from '@/types';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Props = {
  loreEntries: Lore[];
  worldID: string;
};

const NPCList = ({ loreEntries, worldID }: Props) => {
  const router = useRouter();
  return (
    <>
      <h2>Lore</h2>
      <List>
        {loreEntries.map((lore: Lore, index) => {
          return (
            <ListItem key={index}>
              <Link href={`/world/${worldID}/lore/${lore.id}`}>
                {lore.title}
              </Link>
            </ListItem>
          );
        })}
      </List>
      <Button onClick={() => router.push(`world/${worldID}/lore/new`)}>
        Create Lore
      </Button>
    </>
  );
};

export default NPCList;
