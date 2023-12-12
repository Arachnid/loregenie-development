"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { CampaignList } from "@/app/(main)/_components/campaign-list";
import { EntryList } from "@/app/(main)/_components/entry-list";
import { WorldItem } from "@/app/(main)/_components/world-item";
import { getAllWorlds } from "@/server/actions/world";
import { isString } from "@/utils/typeGuards";
import { useQuery } from "@tanstack/react-query";
import { Item } from "./item";

export const WorldList = () => {
  const params = useParams();
  const router = useRouter();
  const initialExpanded =
    params?.worldID && isString(params.worldID)
      ? { [params.worldID]: true }
      : {};
  const [expanded, setExpanded] =
    useState<Record<string, boolean>>(initialExpanded);

  const { data, isLoading } = useQuery({
    queryKey: ["worlds"],
    queryFn: async () => {
      return await getAllWorlds();
    },
  });

  const onExpand = (documentId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId],
    }));
  };

  const onRedirect = (path: string) => {
    router.push(`/worlds/${path}`);
  };

  if (isLoading) {
    return (
      <>
        <Item.Skeleton level={0} />
        <Item.Skeleton level={0} />
      </>
    );
  }

  const worlds = data?.data;

  return (
    <>
      {worlds?.map((world) => (
        <div key={world.id}>
          <WorldItem
            worldID={world.id}
            onClick={() => onRedirect(world.id)}
            active={params?.worldID === world.id}
            onExpand={() => onExpand(world.id)}
            expanded={expanded[world.id]}
          />
          {expanded[world.id] && (
            <>
              {world.campaigns.length > 0 || world.entries.length > 0 ? (
                <>
                  {/*  Campaign List */}
                  <CampaignList
                    worldID={world.id}
                    campaigns={world.campaigns}
                  />
                  {/*  Entity List */}
                  <EntryList
                    worldID={world.id}
                    level={1}
                    entries={world.entries}
                  />
                </>
              ) : (
                <p className="block pl-[37px] text-sm font-medium text-muted-foreground/80">
                  No pages inside
                </p>
              )}
            </>
          )}
        </div>
      ))}
    </>
  );
};
