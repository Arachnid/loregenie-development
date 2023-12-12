"use client";

import { Cover } from "@/components/cover";
import { Toolbar } from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getCampaign,
  updateCampaign as updateCampaignAction,
} from "@/server/actions/campaigns";
import { isString } from "@/utils/typeGuards";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useMemo } from "react";

interface WorldEntryIdPageProps {
  params: {
    worldID: string;
    campaignID: string;
  };
}

const WorldEntryIdPage = ({ params }: WorldEntryIdPageProps) => {
  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    [],
  );
  const queryClient = useQueryClient();
  const parsedCampaignId = isString(params?.campaignID)
    ? params.campaignID
    : "";
  const parsedWorldId = isString(params?.worldID) ? params.worldID : "";
  const { data, isLoading } = useQuery({
    queryKey: ["campaigns", parsedCampaignId],
    queryFn: async () => {
      return await getCampaign({
        worldID: parsedWorldId,
        campaignID: parsedCampaignId,
      });
    },
  });

  const { mutate: updateCampaign } = useMutation({
    mutationFn: updateCampaignAction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["campaigns", parsedCampaignId],
      });
    },
  });

  const onChange = (content: string) => {
    updateCampaign({
      worldID: parsedWorldId,
      campaignID: parsedCampaignId,
      campaignData: {
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

  if (!data?.data) {
    return <div>Not found</div>;
  }

  const campaign = data.data;

  return (
    <div className="pb-40">
      <Cover
        url={campaign.image}
        worldID={params.worldID}
        campaignID={campaign.id}
      />
      <div className="mx-auto md:max-w-3xl lg:max-w-4xl">
        <Toolbar
          initialData={{
            campaignID: campaign.id,
            initialData: campaign,
            worldID: parsedWorldId,
          }}
        />
        <Editor onChange={onChange} initialContent={campaign.description} />
      </div>
    </div>
  );
};

export default WorldEntryIdPage;
