"use client";

import ImageSettings from "@/components/ImageSettings";
import PageBody from "@/components/PageBody";
import PageHeader from "@/components/PageHeader";
import { useClientContext } from "@/hooks/useClientContext";
import { Campaign, CampaignDB, User, World } from "@/types";
import { base64Converter } from "@/utils/base64Converter";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  world: World;
  campaign: Campaign;
  permissions: string[];
  session: Session;
  contributors: User[];
};

const campaignDBConverter = (campaign: Campaign) => {
  const { entries, contributors, ...campaignDB } = campaign;
  return campaignDB;
};

const ClientCampaignPage = ({
  world,
  campaign,
  permissions,
  session,
  contributors,
}: Props) => {
  const [campaignData, setCampaignData] = useState<CampaignDB>(
    campaignDBConverter(campaign),
  );
  const [mounted, setMounted] = useState(false);
  const { setClient } = useClientContext();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setClient({ world, campaign });
  }, [campaign]);

  const onDelete = async () => {
    try {
      await fetch("/api/campaign/delete", {
        method: "POST",
        body: JSON.stringify({
          worldID: world.id,
          campaignID: campaign.id,
        }),
      });
      router.push(`/world/${world.id}`);
      router.refresh();
    } catch (error) {
      console.log("error deleting campaign: ", error);
    }
  };

  const onSave = async () => {
    try {
      await fetch("/api/campaign/update", {
        method: "POST",
        body: JSON.stringify({
          campaignData,
          worldID: world.id,
        }),
      });
      router.refresh();
    } catch (error) {
      console.log("error updating campaign: ", error);
    }
  };

  const onImageUpload = async (uploadedFile: File) => {
    try {
      const base64: string = (await base64Converter(uploadedFile)) as string;
      const filePath = `worlds/${world.id}/campaigns/${campaign.id}/image`;
      await fetch("/api/image/create", {
        method: "POST",
        body: JSON.stringify({ base64, filePath, worldID: world.id }),
      }).then((res) =>
        res.json().then((url: string) => {
          setCampaignData({ ...campaignData, image: url });
          router.refresh();
        }),
      );
    } catch (error) {
      console.log("error submitting image: ", error);
    }
  };

  const onImageDelete = async () => {
    try {
      const filePath = `worlds/${world.id}/campaigns/${campaign.id}/image`;
      await fetch("/api/image/delete", {
        method: "POST",
        body: JSON.stringify({
          filePath,
          worldID: world.id,
        }),
      }).then(() => {
        setCampaignData({ ...campaignData, image: "" });
        router.refresh();
      });
    } catch (error) {
      console.log("error deleting image: ", error);
    }
  };

  if (!mounted) {
    return <div className="h-full w-full bg-white" />;
  }

  return (
    <div className="mb-12 flex h-full w-full flex-col">
      <PageHeader<CampaignDB>
        data={campaignData}
        setData={setCampaignData}
        onSave={onSave}
        onDelete={onDelete}
        permissions={permissions}
        session={session}
        contributors={contributors}
      />
      <div className="scrollbar-hide isolate flex grow flex-col items-start gap-6 overflow-y-scroll bg-white p-4 md:gap-10 md:px-16 md:py-6">
        <div className="relative max-h-[352px] min-h-[352px] w-full rounded-2xl bg-lore-beige-400">
          <div className="absolute bottom-4 right-4 flex">
            <ImageSettings<CampaignDB>
              data={campaignData}
              setData={setCampaignData}
              permissions={permissions}
              onUpload={onImageUpload}
              onDelete={onImageDelete}
            />
          </div>
          {campaignData.image && (
            <img
              className="h-full w-full rounded-lg object-cover"
              src={`${campaignData.image}?${Date.now()}`}
              alt=""
            />
          )}
        </div>
        <PageBody<CampaignDB>
          data={campaignData}
          setData={setCampaignData}
          permissions={permissions}
        />
      </div>
    </div>
  );
};

export default ClientCampaignPage;
