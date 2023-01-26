'use client';

import { Campaign, Category, Entry, EntryHierarchy, World } from '@/types';
import { createEntryHierarchy } from '@/utils/createEntryHierarchy';
import { Collapse } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import { MdLocationOn, MdOutlineLocationOn } from 'react-icons/md';
import {
  AiFillFolder,
  AiOutlineFolder,
  AiOutlinePlus,
  AiOutlineMinus,
  AiFillHome,
  AiOutlineHome,
} from 'react-icons/ai';
import {
  BsBookmarkStar,
  BsBookmarkStarFill,
  BsPerson,
  BsPersonFill,
} from 'react-icons/bs';

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
      <>
        <ul className='pl-[5px] m-2'>
          <li className='flex justify-between items-center'>
            <Link
              className={`flex items-center ${
                selected === campaign.id ? 'text-lore-red' : 'text-lore-blue'
              }`}
              href={`/world/${world.id}/campaign/${campaign.id}`}
              onClick={() => {
                setSelected(campaign.id);
                setOpen({ ...open, [campaign.id]: true });
              }}
            >
              {selected === campaign.id ? (
                <AiFillFolder />
              ) : (
                <AiOutlineFolder />
              )}
              <div className='pl-2'>{campaign.name}</div>
            </Link>
            {campaign.entries && campaign.entries.length > 0 && (
              <div
                className={`flex m-2 cursor-pointer ${
                  selected === campaign.id ? 'text-lore-red' : 'text-lore-blue'
                }`}
                onClick={() => expandHandler(campaign.id, open, setOpen)}
              >
                {open[campaign.id] ? <AiOutlineMinus /> : <AiOutlinePlus />}
              </div>
            )}
          </li>
        </ul>
        {campaign.entries && campaign.entries.length > 0 && (
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
        )}
      </>
    );
  }

  return (
    <div className='flex'>
      <div className='flex flex-col mb-[21px]'>
        <div className='ml-[19px] bg-lore-beige w-[3px] h-full' />
      </div>
      <ul className='flex flex-col w-full'>
        {entryHierarchy.map((entry: EntryHierarchy, index) => {
          return (
            <div key={index}>
              <div className='flex items-center'>
                <div className='w-2 h-[3px] bg-lore-beige border-l-4 border-lore-beige rounded-bl -ml-[3px]' />
                <li className='flex justify-between items-center m-2 w-full'>
                  <Link
                    className={`flex items-center ${
                      selected === entry.id ? 'text-lore-red' : 'text-lore-blue'
                    }`}
                    href={
                      campaignID
                        ? `/world/${world.id}/campaign/${campaignID}/entry/${entry.id}`
                        : `/world/${world.id}/entry/${entry.id}`
                    }
                    onClick={() => {
                      setSelected(entry.id);
                      setOpen({ ...open, [entry.id]: true });
                    }}
                  >
                    {entry.category === Category.NPC &&
                      (selected === entry.id ? <BsPersonFill /> : <BsPerson />)}
                    {entry.category === Category.Location &&
                      (selected === entry.id ? (
                        <MdLocationOn />
                      ) : (
                        <MdOutlineLocationOn />
                      ))}
                    {entry.category === Category.Journal &&
                      (selected === entry.id ? (
                        <BsBookmarkStarFill />
                      ) : (
                        <BsBookmarkStar />
                      ))}
                    <div className='pl-2'>{entry.name}</div>
                  </Link>
                  {entry.children && entry.children.length > 0 && (
                    <div
                      className={`flex m-2 cursor-pointer ${
                        selected === entry.id
                          ? 'text-lore-red'
                          : 'text-lore-blue'
                      }`}
                      onClick={() => expandHandler(entry.id, open, setOpen)}
                    >
                      {open[entry.id] ? <AiOutlineMinus /> : <AiOutlinePlus />}
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
      </ul>
    </div>
  );
};

const EntriesList = ({ entries, campaigns, world }: Props) => {
  const pathname = usePathname();
  const [selected, setSelected] = useState<string | undefined>(
    getActiveEntryID(pathname)
  );

  return (
    <div className='pr-2 font-medium'>
      <ul className='pl-[5px] m-2'>
        <li>
          <Link
            className={`flex items-center mt-2 ${
              selected === world.id ? 'text-lore-red' : 'text-lore-blue'
            }`}
            href={`/world/${world.id}`}
            onClick={() => {
              setSelected(world.id);
            }}
          >
            {selected === world.id ? <AiFillHome /> : <AiOutlineHome />}
            <div className='pl-2'>{world.name}</div>
          </Link>
        </li>
      </ul>
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
    </div>
  );
};

export default EntriesList;
