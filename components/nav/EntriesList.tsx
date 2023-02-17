'use client';

import { Campaign, Entry, EntryHierarchy, World } from '@/types';
import { createEntryHierarchy } from '@/utils/createEntryHierarchy';
import { getActiveID } from '@/utils/getActiveID';
import { getIcon } from '@/utils/getIcon';
import { Collapse } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

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

const RecursiveEntries = ({
  entryHierarchy,
  world,
  entries,
  selected,
  campaign,
  campaignID,
  iteration,
}: {
  entryHierarchy: EntryHierarchy[];
  world: World;
  entries: Entry[];
  selected: string | undefined;
  campaign?: Campaign;
  campaignID?: string;
  iteration: number;
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
      <div className='flex'>
        <ul className='flex flex-col w-full'>
          <div className='flex items-center gap-2 p-2 transition-all duration-300 ease-out rounded-lg h-9 hover:bg-lore-beige-300'>
            <li className='flex items-center justify-between w-full'>
              <Link
                className={`flex items-center gap-2 ${
                  selected === campaign.id
                    ? 'text-lore-red-400'
                    : 'text-lore-blue-400'
                }`}
                href={`/world/${world.id}/campaign/${campaign.id}`}
                onClick={() => {
                  setOpen({ ...open, [campaign.id]: true });
                }}
              >
                {selected === campaign.id ? (
                  <span className='flex justify-center items-center text-[20px] material-icons'>
                    folder
                  </span>
                ) : (
                  <span className='flex justify-center items-center text-[20px] material-icons-outlined'>
                    folder
                  </span>
                )}
                <p>{campaign.name ? campaign.name : 'Untitled Campaign'}</p>
              </Link>
              {campaign.entries && campaign.entries.length > 0 && (
                <div
                  className={`flex cursor-pointer ${
                    selected === campaign.id
                      ? 'text-lore-red-400'
                      : 'text-lore-blue-400'
                  }`}
                  onClick={() => expandHandler(campaign.id, open, setOpen)}
                >
                  {open[campaign.id] ? (
                    <span className='flex justify-center items-center text-[16px] material-icons'>
                      remove
                    </span>
                  ) : (
                    <span className='flex justify-center items-center text-[16px] material-icons'>
                      add
                    </span>
                  )}
                </div>
              )}
            </li>
          </div>
          {campaign.entries && campaign.entries.length > 0 && (
            <Collapse in={open[campaign.id]} timeout='auto' unmountOnExit>
              <RecursiveEntries
                entryHierarchy={createEntryHierarchy(campaign.entries)}
                world={world}
                entries={entries}
                selected={selected}
                campaignID={campaign.id}
                iteration={2}
              />
            </Collapse>
          )}
        </ul>
      </div>
    );
  }

  return (
    <div className='flex'>
      {iteration === 2 && (
        <div className='flex flex-col mb-7 ml-[16px]'>
          <div className='bg-lore-beige-500 w-[2px] h-full' />
        </div>
      )}
      {iteration > 2 && (
        <div className='flex flex-col mb-7 ml-[34px]'>
          <div className='bg-lore-beige-500 w-[2px] h-full' />
        </div>
      )}
      <ul className='flex flex-col w-full'>
        {entryHierarchy.map((entry: EntryHierarchy, index) => {
          return (
            <div key={index}>
              <div className='flex items-center'>
                {iteration !== 1 && (
                  <img
                    className='mb-5 -ml-[2px]'
                    src='/menu-line-curve.svg'
                    alt='-'
                  />
                )}
                <li className='flex items-center justify-between w-full gap-2 p-2 transition-all duration-300 ease-out rounded-lg h-9 hover:bg-lore-beige-300'>
                  <Link
                    className={`flex items-center gap-2 ${
                      selected === entry.id
                        ? 'text-lore-red-400'
                        : 'text-lore-blue-400'
                    }`}
                    href={
                      campaignID
                        ? `/world/${world.id}/campaign/${campaignID}/entry/${entry.id}`
                        : `/world/${world.id}/entry/${entry.id}`
                    }
                    onClick={() => {
                      setOpen({ ...open, [entry.id]: true });
                    }}
                  >
                    {entry.category &&
                      (selected === entry.id
                        ? getIcon(
                            entry.category,
                            'flex justify-center items-center text-[20px] material-icons'
                          )
                        : getIcon(
                            entry.category,
                            'flex justify-center items-center text-[20px] material-icons-outlined'
                          ))}
                    <p className='w-max'>
                      {entry.name ? entry.name : 'Untitled'}
                    </p>
                  </Link>
                  {entry.children && entry.children.length > 0 && (
                    <div
                      className={`flex cursor-pointer ${
                        selected === entry.id
                          ? 'text-lore-red-400'
                          : 'text-lore-blue-400'
                      }`}
                      onClick={() => expandHandler(entry.id, open, setOpen)}
                    >
                      {open[entry.id] ? (
                        <span className='flex justify-center items-center text-[16px] material-icons'>
                          remove
                        </span>
                      ) : (
                        <span className='flex justify-center items-center text-[16px] material-icons'>
                          add
                        </span>
                      )}
                    </div>
                  )}
                </li>
              </div>
              {entry.children && entry.children.length > 0 ? (
                <Collapse in={open[entry.id]} timeout='auto' unmountOnExit>
                  <RecursiveEntries
                    entryHierarchy={entry.children}
                    world={world}
                    entries={entries}
                    selected={selected}
                    campaignID={campaignID}
                    iteration={iteration + 1}
                  />
                </Collapse>
              ) : (
                ''
              )}
            </div>
          );
        })}
      </ul>
    </div>
  );
};

const EntriesList = ({ entries, campaigns, world }: Props) => {
  const pathname = usePathname();
  const [selected, setSelected] = useState<string | undefined>(
    getActiveID(pathname)
  );

  useEffect(() => {
    const activeID = getActiveID(pathname);
    setSelected(activeID);
  }, [pathname]);

  return (
    <div className='font-medium text-[16px]'>
      <div className='flex'>
        <ul className='flex flex-col w-full'>
          <div className='flex items-center gap-2 p-2 rounded-lg h-9 hover:bg-lore-beige-300'>
            <li className='flex items-center justify-between w-full'>
              <Link
                className={`flex items-center gap-2 ${
                  selected === world.id
                    ? 'text-lore-red-400'
                    : 'text-lore-blue-400'
                }`}
                href={`/world/${world.id}`}
              >
                {selected === world.id ? (
                  <span className='flex items-center justify-center w-5 h-5 material-icons'>
                    home
                  </span>
                ) : (
                  <span className='flex items-center justify-center w-5 h-5 material-icons-outlined'>
                    home
                  </span>
                )}
                <p>{world.name ? world.name : 'Untitled'}</p>
              </Link>
            </li>
          </div>
        </ul>
      </div>
      <div className='mt-3'>
        {campaigns.map((campaign, index) => (
          <div key={index}>
            <RecursiveEntries
              entries={campaign.entries}
              entryHierarchy={createEntryHierarchy(campaign.entries)}
              world={world}
              selected={selected}
              campaign={campaign}
              campaignID={campaign.id}
              iteration={2}
            />
          </div>
        ))}
      </div>
      <div className='mt-4'>
        <RecursiveEntries
          entries={entries}
          entryHierarchy={createEntryHierarchy(entries)}
          world={world}
          selected={selected}
          iteration={1}
        />
      </div>
    </div>
  );
};

export default EntriesList;
