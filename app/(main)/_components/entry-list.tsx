"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { EntryItem } from "@/app/(main)/_components/entry-item";
import { Entry } from "@/types";
import { isString } from "@/utils/typeGuards";

function getParentIds(entries: Entry[], childId: string): string[] {
  const parents: string[] = [];
  let currentEntry = entries.find((entry) => entry.id === childId);

  while (currentEntry && currentEntry?.parent?.id) {
    const parentId = currentEntry?.parent?.id;
    parents.push(parentId);
    currentEntry = entries.find((entry) => entry.id === parentId);
  }

  return parents;
}
interface EntryListProps {
  worldID: string;
  campaignID?: string;
  level?: number;
  entries?: Entry[];
  parentEntry?: Entry;
}

export const EntryList = ({
  worldID,
  campaignID,
  level = 0,
  entries,
  parentEntry,
}: EntryListProps) => {
  const params = useParams();
  const router = useRouter();
  const parsedEntryID = isString(params?.entryID) ? params.entryID : undefined;

  let curEntries: Array<Entry> = [];

  if (!parentEntry) {
    curEntries = entries?.filter((entry) => !entry.parent) ?? [];
  } else {
    curEntries =
      entries?.filter((entry) => entry?.parent?.id === parentEntry.id) ?? [];
  }

  const remainingEntries =
    entries?.filter((entry) => curEntries?.indexOf(entry) === -1) ?? [];

  const expandedIds = getParentIds(entries ?? [], parsedEntryID ?? "");

  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    expandedIds.reduce<Record<string, boolean>>(
      (acc, id) => {
        acc[id] = true;
        return acc;
      },
      {
        [parsedEntryID ?? ""]: true,
      },
    ),
  );

  const onExpand = (documentId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId],
    }));
  };
  const onRedirect = (entryID: string) => {
    const path = campaignID
      ? `/worlds/${worldID}/campaigns/${campaignID}/entries/${entryID}`
      : `/worlds/${worldID}/entries/${entryID}`;
    router.push(path);
  };

  return (
    <>
      <p
        style={{
          paddingLeft: level ? `${level * 12 + 25}px` : undefined,
        }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80",
          expanded && "last:block",
          level === 0 && "hidden",
        )}
      >
        No pages inside
      </p>
      {curEntries?.map((entry) => (
        <div key={entry.id}>
          <EntryItem
            worldID={worldID}
            campaignID={campaignID}
            entryID={entry.id}
            onClick={() => onRedirect(entry.id)}
            active={params?.entryID === entry.id}
            level={level}
            onExpand={() => onExpand(entry.id)}
            expanded={expanded[entry.id]}
          />
          {expanded[entry.id] && (
            <EntryList
              worldID={worldID}
              campaignID={campaignID}
              level={level + 1}
              entries={remainingEntries}
              parentEntry={entry}
            />
          )}
        </div>
      ))}
    </>
  );
};
