'use client';

import { Entry, World } from '@/types';
import { ListItem } from '@mui/material';
import List from '@mui/material/List';
import Link from 'next/link';

type Props = {
  entries: Entry[];
  world: World;
};

const EntriesList = ({ entries, world }: Props) => {
  return (
    <List>
      <ListItem>
        <Link href={`/world/${world.id}`}>{world.name}</Link>
      </ListItem>
      {entries.map((entry, index) => (
        <ListItem key={index}>
          <Link href={`/world/${world.id}/entry/${entry.id}`}>
            {entry.name}
          </Link>
        </ListItem>
      ))}
    </List>
  );
};

export default EntriesList;
