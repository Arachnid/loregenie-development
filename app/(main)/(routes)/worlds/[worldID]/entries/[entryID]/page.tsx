"use client";

import { Cover } from "@/components/cover";
import { Toolbar } from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getEntry,
  updateEntry as updateEntryAction,
} from "@/server/actions/entry";
import { isString } from "@/utils/typeGuards";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useMemo } from "react";

interface WorldEntryIdPageProps {
  params: {
    worldID: string;
    entryID: string;
  };
}

const WorldEntryIdPage = ({ params }: WorldEntryIdPageProps) => {
  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    [],
  );
  const queryClient = useQueryClient();
  const parsedEntryId = isString(params?.entryID) ? params.entryID : "";
  const parsedWorldId = isString(params?.worldID) ? params.worldID : "";
  const { data, isLoading } = useQuery({
    queryKey: ["entries", parsedEntryId],
    queryFn: async () => {
      return await getEntry({
        worldID: parsedWorldId,
        entryID: parsedEntryId,
      });
    },
  });

  const { mutate: updateEntry } = useMutation({
    mutationFn: updateEntryAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries", parsedEntryId] });
    },
  });

  const onChange = (content: string) => {
    updateEntry({
      worldID: parsedWorldId,
      entryID: parsedEntryId,
      entryData: {
        description: content,
      },
    });
  };

  if (isLoading) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="mx-auto mt-10 md:max-w-3xl lg:max-w-4xl">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (!data?.entry) {
    return <div>Not found</div>;
  }

  const entry = data.entry;

  return (
    <div className="pb-40">
      <Cover url={entry.image} worldID={params.worldID} entryID={entry.id} />
      <div className="mx-auto md:max-w-3xl lg:max-w-4xl">
        <Toolbar
          initialData={{
            entryID: entry.id,
            initialData: entry,
            worldID: parsedWorldId,
          }}
        />
        <Editor onChange={onChange} initialContent={entry.description} />
      </div>
    </div>
  );
};

export default WorldEntryIdPage;
