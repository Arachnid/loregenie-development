import { CampaignItem } from "@/app/(main)/_components/campaign-item";
import { EntryList } from "@/app/(main)/_components/entry-list";
import { cn } from "@/lib/utils";
import { Campaign } from "@/types";
import { isString } from "@/utils/typeGuards";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

type CampaignListProps = {
  worldID: string;
  campaigns?: Campaign[];
};

export const CampaignList = ({ worldID, campaigns }: CampaignListProps) => {
  const params = useParams();
  const router = useRouter();
  const initialExpanded =
    params?.campaignID && isString(params.campaignID)
      ? { [params.campaignID]: true }
      : {};
  const [expanded, setExpanded] =
    useState<Record<string, boolean>>(initialExpanded);

  const onExpand = (documentId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId],
    }));
  };
  const onRedirect = (campaignID: string) => {
    router.push(`/worlds/${worldID}/campaigns/${campaignID}`);
  };

  return (
    <>
      <p
        className={cn(
          "hidden pl-[27px] text-sm font-medium text-muted-foreground/80",
          expanded && "last:block",
        )}
      >
        No pages inside
      </p>
      {campaigns?.map((campaign) => {
        return (
          <div key={campaign.id}>
            <CampaignItem
              worldID={worldID}
              campaignID={campaign.id}
              onClick={() => onRedirect(campaign.id)}
              active={params?.campaignID === campaign.id}
              onExpand={() => onExpand(campaign.id)}
              expanded={expanded[campaign.id]}
            />
            {expanded[campaign.id] && (
              <EntryList
                worldID={worldID}
                campaignID={campaign.id}
                level={2}
                entries={campaign.entries}
              />
            )}
          </div>
        );
      })}
    </>
  );
};
