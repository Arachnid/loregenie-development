'use client';

import { Campaign, Entry, EntryHierarchy, World } from '@/types';
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
  campaigns: Campaign[];
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
  campaign,
  campaignID,
}: {
  entryHierarchy: EntryHierarchy[];
  world: World;
  entries: Entry[];
  selected: string | undefined;
  setSelected: Dispatch<SetStateAction<string | undefined>>;
  campaign?: Campaign;
  campaignID?: string;
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
      if (campaignID) {
        initialState[campaignID] = true;
      }
      initialState[entry.id] = true;
    }
    if (campaign && selected === campaign.id) {
      initialState[campaign.id] = true;
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

  if (campaign) {
    return (
      <List disablePadding sx={{ pl: 1 }}>
        <ListItem>
          <ListItemButton
            component={Link}
            href={`/world/${world.id}/campaign/${campaign.id}`}
            onClick={() => {
              setSelected(campaign.id);
              setOpen({ ...open, [campaign.id]: true });
            }}
            selected={campaign.id === selected}
          >
            <ListItemText primary={campaign.name} />
          </ListItemButton>
          {campaign.entries && campaign.entries.length > 0 ? (
            <a onClick={() => expandHandler(campaign.id, open, setOpen)}>
              {open[campaign.id] ? <ExpandLess /> : <ExpandMore />}
            </a>
          ) : (
            ''
          )}
        </ListItem>
        {campaign.entries && campaign.entries.length > 0 ? (
          <Collapse in={open[campaign.id]} timeout='auto' unmountOnExit>
            <RecursiveEntries
              entryHierarchy={createEntryHierarchy(campaign.entries)}
              world={world}
              entries={entries}
              selected={selected}
              setSelected={setSelected}
              campaignID={campaign.id}
            />
          </Collapse>
        ) : (
          ''
        )}
      </List>
    );
  }

  return (
    <List disablePadding sx={{ pl: 1 }}>
      {entryHierarchy.map((entry: EntryHierarchy, index) => {
        return (
          <div key={index}>
            <ListItem>
              <ListItemButton
                component={Link}
                href={
                  campaignID
                    ? `/world/${world.id}/campaign/${campaignID}/entry/${entry.id}`
                    : `/world/${world.id}/entry/${entry.id}`
                }
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
                  campaignID={campaignID}
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

const EntriesList = ({ entries, campaigns, world }: Props) => {
  const pathname = usePathname();
  const [selected, setSelected] = useState<string | undefined>(
    getActiveEntryID(pathname)
  );

  return (
    <>
      <List disablePadding sx={{ pl: 1 }}>
        <ListItem>
          <ListItemButton
            component={Link}
            href={`/world/${world.id}`}
            onClick={() => {
              setSelected(world.id);
            }}
            selected={world.id === selected}
          >
            <ListItemText primary={world.name} />
          </ListItemButton>
        </ListItem>
      </List>
      <RecursiveEntries
        entries={entries}
        entryHierarchy={createEntryHierarchy(entries)}
        world={world}
        selected={selected}
        setSelected={setSelected}
      />
      {campaigns.map((campaign, index) => (
        <div key={index}>
          <RecursiveEntries
            entries={campaign.entries}
            entryHierarchy={createEntryHierarchy(campaign.entries)}
            world={world}
            selected={selected}
            setSelected={setSelected}
            campaign={campaign}
            campaignID={campaign.id}
          />
        </div>
      ))}
    </>
  );
};

export default EntriesList;
