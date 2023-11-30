"use client";

import { Campaign, Entry, EntryHierarchy, World } from "@/types";
import { createEntryHierarchy } from "@/utils/createEntryHierarchy";
import { getActiveID } from "@/utils/getActiveID";
import { getIcon } from "@/utils/getIcon";
import { Collapse } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  MdAdd,
  MdFolder,
  MdHome,
  MdOutlineFolder,
  MdOutlineHome,
  MdRemove,
} from "react-icons/md";

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
  setOpen: Dispatch<SetStateAction<Open>>,
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
          initialState,
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
        initialState,
      );
    }
    return initialState;
  };

  const [open, setOpen] = useState<Open>(() => initializeOpenEntries());

  if (campaign) {
    return (
      <div className="flex">
        <ul className="flex w-full flex-col">
          <div className="flex h-9 items-center gap-2 rounded-lg p-2 transition-all duration-300 ease-out hover:bg-lore-beige-300">
            <li className="flex w-full items-center justify-between">
              <Link
                className={`flex items-center gap-2 ${
                  selected === campaign.id
                    ? "text-lore-red-400"
                    : "text-lore-blue-400"
                }`}
                href={`/world/${world.id}/campaign/${campaign.id}`}
                onClick={() => {
                  setOpen({ ...open, [campaign.id]: true });
                }}
              >
                {selected === campaign.id ? (
                  <MdFolder className="h-5 w-5" />
                ) : (
                  <MdOutlineFolder className="h-5 w-5" />
                )}
                <p>{campaign.name ? campaign.name : "Untitled Campaign"}</p>
              </Link>
              {campaign.entries && campaign.entries.length > 0 && (
                <div
                  className={`flex cursor-pointer ${
                    selected === campaign.id
                      ? "text-lore-red-400"
                      : "text-lore-blue-400"
                  }`}
                  onClick={() => expandHandler(campaign.id, open, setOpen)}
                >
                  {open[campaign.id] ? (
                    <MdRemove className="h-4 w-4" />
                  ) : (
                    <MdAdd className="h-4 w-4" />
                  )}
                </div>
              )}
            </li>
          </div>
          {campaign.entries && campaign.entries.length > 0 && (
            <Collapse in={open[campaign.id]} timeout="auto" unmountOnExit>
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
    <div className="flex">
      {iteration === 2 && (
        <div className="mb-7 ml-[16px] flex flex-col">
          <div className="h-full w-[2px] bg-lore-beige-500" />
        </div>
      )}
      {iteration > 2 && (
        <div className="mb-7 ml-[34px] flex flex-col">
          <div className="h-full w-[2px] bg-lore-beige-500" />
        </div>
      )}
      <ul className="flex w-full flex-col">
        {entryHierarchy.map((entry: EntryHierarchy, index) => {
          return (
            <div key={index}>
              <div className="flex items-center">
                {iteration !== 1 && (
                  <img
                    className="-ml-[2px] mb-5"
                    src="/menu-line-curve.svg"
                    alt="-"
                  />
                )}
                <li className="flex h-9 w-full items-center justify-between gap-2 rounded-lg p-2 transition-all duration-300 ease-out hover:bg-lore-beige-300">
                  <Link
                    className={`flex items-center gap-2 ${
                      selected === entry.id
                        ? "text-lore-red-400"
                        : "text-lore-blue-400"
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
                        ? getIcon(entry.category, "h-5 w-5")
                        : getIcon(entry.category, "h-5 w-5"))}
                    <p className="w-max">
                      {entry.name ? entry.name : "Untitled"}
                    </p>
                  </Link>
                  {entry.children && entry.children.length > 0 && (
                    <div
                      className={`flex cursor-pointer ${
                        selected === entry.id
                          ? "text-lore-red-400"
                          : "text-lore-blue-400"
                      }`}
                      onClick={() => expandHandler(entry.id, open, setOpen)}
                    >
                      {open[entry.id] ? (
                        <MdRemove className="h-4 w-4" />
                      ) : (
                        <MdAdd className="h-4 w-4" />
                      )}
                    </div>
                  )}
                </li>
              </div>
              {entry.children && entry.children.length > 0 ? (
                <Collapse in={open[entry.id]} timeout="auto" unmountOnExit>
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
                ""
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
    getActiveID(pathname),
  );

  useEffect(() => {
    const activeID = getActiveID(pathname);
    setSelected(activeID);
  }, [pathname]);

  return (
    <div className="text-[16px] font-medium">
      <div className="flex">
        <ul className="flex w-full flex-col">
          <div className="flex h-9 items-center gap-2 rounded-lg p-2 hover:bg-lore-beige-300">
            <li className="flex w-full items-center justify-between">
              <Link
                className={`flex items-center gap-2 ${
                  selected === world.id
                    ? "text-lore-red-400"
                    : "text-lore-blue-400"
                }`}
                href={`/world/${world.id}`}
              >
                {selected === world.id ? (
                  <MdHome className="h-5 w-5" />
                ) : (
                  <MdOutlineHome className="h-5 w-5" />
                )}
                <p>{world.name ? world.name : "Untitled"}</p>
              </Link>
            </li>
          </div>
        </ul>
      </div>
      <div className="mt-3">
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
      <div className="mt-4">
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
