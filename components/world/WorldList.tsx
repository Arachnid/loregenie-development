'use client';

import { World } from '@/types';
import AddIcon from '@mui/icons-material/Add';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Link from 'next/link';

type Props = {
  worlds: World[];
};

const WorldsList = ({ worlds }: Props) => {
  return (
    <List
      disablePadding
      subheader={
        <ListSubheader>
          Worlds
          <Link href='/world/new'>
            <AddIcon />
          </Link>
        </ListSubheader>
      }
    >
      {worlds.map((world: World, index) => {
        return (
          <ListItem key={index}>
            <ListItemButton component={Link} href={`/world/${world.id}`}>
              <ListItemText primary={world.name} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default WorldsList;
