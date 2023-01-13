'use client';

import { Entry, EntryHierarchy, World } from '@/types';
import { createEntryHierarchy } from '@/utils/createEntryHierarchy';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Collapse,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import List from '@mui/material/List';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';

type Props = {
  entries: Entry[];
  world: World;
};

interface Open {
  [key: string]: boolean;
}

const expandHandler = (
  id: string,
  open: Open,
  setOpen: Dispatch<SetStateAction<Open>>
) => {
  const newOpen: Open = Object.assign({}, open, { [id]: !open[id] });
  setOpen(newOpen);
};

const getActiveEntryID = (pathname: string | null): string | undefined => {
  const idAfterLastSlash = '([^/]+$)';
  let activeID: string;

  if (pathname) {
    const regex: RegExpMatchArray | null = pathname.match(idAfterLastSlash);
    if (regex !== null) {
      activeID = regex[0];
      return activeID;
    }
  }

  return undefined;
};

const RecursiveEntries = ({
  entryHierarchy,
  world,
  entries,
  selected,
  setSelected,
}: {
  entryHierarchy: EntryHierarchy[];
  world: World;
  entries: Entry[];
  selected: string | undefined;
  setSelected: Dispatch<SetStateAction<string | undefined>>;
}) => {
  const setParentToOpen = (entry: Entry | undefined, initialState: Open) => {
    if (entry) {
      if (entry.parent) {
        initialState[entry.parent.id] = true;
        initialState[entry.id] = true;
        setParentToOpen(
          entries.find((entry2) => entry2.id === entry.parent?.id),
          initialState
        );
      }
      initialState[entry.id] = true;
    }
  };

  const initializeOpenEntries = (): Open => {
    const activeEntryID = selected;
    const initialState: Open = {};
    if (activeEntryID) {
      setParentToOpen(
        entries.find((entry) => entry.id === activeEntryID),
        initialState
      );
    }
    return initialState;
  };

  const [open, setOpen] = useState<Open>(() => initializeOpenEntries());

  return (
    <List disablePadding sx={{ pl: 1 }}>
      {entryHierarchy.map((entry: EntryHierarchy, index) => {
        return (
          <div key={index}>
            <ListItem>
              <ListItemButton
                component={Link}
                href={`/world/${world.id}/entry/${entry.id}`}
                onClick={() => {
                  setSelected(entry.id);
                  setOpen({ ...open, [entry.id]: true });
                }}
                selected={entry.id === selected}
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
                  entries={entries}
                  selected={selected}
                  setSelected={setSelected}
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
  const pathname = usePathname();
  const [selected, setSelected] = useState<string | undefined>(
    getActiveEntryID(pathname)
  );
  const entryHierarchy = createEntryHierarchy(entries);

  return (
    <List>
      <ListItemButton component={Link} href={`/world/${world.id}`}>
        <ListItemText primary={world.name} />
      </ListItemButton>
      <RecursiveEntries
        entries={entries}
        entryHierarchy={entryHierarchy}
        world={world}
        selected={selected}
        setSelected={setSelected}
      />
    </List>
  );
};

export default EntriesList;
