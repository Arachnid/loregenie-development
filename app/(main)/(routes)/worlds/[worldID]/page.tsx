"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import Chat from "@/components/chat/chat";
import { Cover } from "@/components/cover";
import { Toolbar } from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getWorld,
  updateWorld as updateWorldAction,
} from "@/server/actions/world";
import { isString } from "@/utils/typeGuards";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface DocumentIdPageProps {
  params: {
    worldID: string;
  };
}

const WorldIDPage = ({ params }: DocumentIdPageProps) => {
  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    [],
  );
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["worlds", params.worldID],
    queryFn: async () => {
      return await getWorld(isString(params?.worldID) ? params.worldID : "");
    },
  });

  const { mutate: updateWorld } = useMutation({
    mutationFn: updateWorldAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worlds", params.worldID] });
    },
  });

  const onChange = (content: string) => {
    updateWorld({
      id: params.worldID,
      description: content,
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

  if (!data?.data) {
    return <div>Not found</div>;
  }

  const world = data.data;

  return (
    <div>
      <div className="flex">
        <div className="flex-auto pb-40">
          <Cover url={world.image} worldID={params.worldID} />
          <div className="mx-auto md:max-w-3xl lg:max-w-4xl">
            <Toolbar
              initialData={{
                worldID: world.id,
                initialData: world,
              }}
            />
            <Editor onChange={onChange} initialContent={world.description} />
          </div>
        </div>
        <div className="flex-1">
          <div className="relative h-[calc(100svh-52px)] w-[500px]">
            <Chat assistantId={world.assistantId || ""} worldID={world.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldIDPage;
