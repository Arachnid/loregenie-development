'use client';

import { NPC, NPCMap } from '@/types';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import ListItem from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import AddIcon from '@mui/icons-material/Add';

type Props = {
  npcs: NPCMap;
};

const NPCList = ({ npcs }: Props) => {
  return (
    <>
      <List
        disablePadding
        sx={{ pl: 1 }}
        subheader={
          <ListSubheader>
            NPCs
            <Link href='/npc/new'>
              <AddIcon />
            </Link>
          </ListSubheader>
        }
      >
        {Object.values(npcs).map((npc: NPC, index) => {
          return (
            <div key={index}>
              <ListItem>
                <ListItemButton component={Link} href={`/npc/${npc.id}`}>
                  <ListItemText primary={npc.name} />
                </ListItemButton>
              </ListItem>
            </div>
          );
        })}
      </List>
    </>
  );
};

export default NPCList;
