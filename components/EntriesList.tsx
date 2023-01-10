'use client';

import { Entry, World } from '@/types';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Collapse,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import List from '@mui/material/List';
import Link from 'next/link';
import { Dispatch, SetStateAction, useState } from 'react';

type Props = {
  entries: Entry[];
  world: World;
};

interface EntryHierarchy extends Entry {
  children?: EntryHierarchy[];
}

const createParentHierarchy = (entries: Entry[]): EntryHierarchy[] => {
  const result: EntryHierarchy[] = [];
  const mappedEntries: Record<string, EntryHierarchy> = {};
  entries.forEach((entry: Entry) => {
    const id: string = entry.id;
    if (!mappedEntries.hasOwnProperty(id)) {
      mappedEntries[id] = entry;
      mappedEntries[id].children = [];
    }
  });
  for (const id in mappedEntries) {
    if (mappedEntries.hasOwnProperty(id)) {
      const mappedEntry: EntryHierarchy = mappedEntries[id];
      if (mappedEntry.parent) {
        const parentID: string = mappedEntry.parent.id;
        mappedEntries[parentID].children?.push(mappedEntry);
      } else {
        result.push(mappedEntry);
      }
    }
  }
  return result;
};

interface Open {
  [key: string]: boolean;
}

const expandHandler = (
  id: string,
  open: Open,
  setOpen: Dispatch<SetStateAction<Open>>
) => {
  const newOpen = Object.assign({}, open, { [id]: !open[id] });
  setOpen(newOpen);
};

const RecursiveEntries = ({
  entryHierarchy,
  world,
}: {
  entryHierarchy: EntryHierarchy[];
  world: World;
}) => {
  const [open, setOpen] = useState<Open>(
    Object.fromEntries(
      entryHierarchy.map((entry: EntryHierarchy) => [entry.id, false])
    )
  );

  return (
    <List disablePadding sx={{ pl: 1 }}>
      {entryHierarchy.map((entry: EntryHierarchy, index) => {
        return (
          <div key={index}>
            <ListItem>
              <ListItemButton
                component={Link}
                href={`/world/${world.id}/entry/${entry.id}`}
              >
                <ListItemText primary={entry.name} />
              </ListItemButton>
              {entry.children && entry.children.length > 0 ? (
                <a onClick={() => expandHandler(entry.id, open, setOpen)}>
                  {open[entry.id] ? <ExpandLess /> : <ExpandMore />}
                </a>
              ) : (
                ''
              )}
            </ListItem>
            {entry.children && entry.children.length > 0 ? (
              <Collapse in={open[entry.id]} timeout='auto' unmountOnExit>
                <RecursiveEntries
                  entryHierarchy={entry.children}
                  world={world}
                />
              </Collapse>
            ) : (
              ''
            )}
          </div>
        );
      })}
    </List>
  );
};

const EntriesList = ({ entries, world }: Props) => {
  const entryHierarchy = createParentHierarchy(entries);
  return (
    <List>
      <ListItemButton component={Link} href={`/world/${world.id}`}>
        <ListItemText primary={world.name} />
      </ListItemButton>
      <RecursiveEntries entryHierarchy={entryHierarchy} world={world} />
    </List>
  );
};

export default EntriesList;
