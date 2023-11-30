"use client";

import ImageSettings from "@/components/ImageSettings";
import PageBody from "@/components/PageBody";
import PageHeader from "@/components/PageHeader";
import { useClientContext } from "@/hooks/useClientContext";
import useStore from "@/hooks/useStore";
import { Campaign, User, World, WorldDB } from "@/types";
import { base64Converter } from "@/utils/base64Converter";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";

type Props = {
  world: World;
  campaigns: Campaign[];
  permissions: string[];
  session: Session;
  contributors: User[];
};

const worldDBConverter = (world: World) => {
  const { entries, campaigns, contributors, ...worldDB } = world;
  return worldDB;
};

const WorldPage = ({
  world,
  campaigns,
  permissions,
  session,
  contributors,
}: Props) => {
  const [worldData, setWorldData] = useState<WorldDB>(worldDBConverter(world));
  const [mounted, setMounted] = useState(false);
  const { client, setClient } = useClientContext();
  const store = useStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const newWorldData: WorldDB = { ...worldData };

    if (
      store.world.description &&
      store.world.description !== worldData.description
    ) {
      newWorldData.description = store.world.description;
    }
    if (store.world.name && store.world.name !== worldData.name) {
      newWorldData.name = store.world.name;
    }
    if (
      store.world.imagePrompt &&
      store.world.imagePrompt !== worldData.imagePrompt
    ) {
      newWorldData.imagePrompt = store.world.imagePrompt;
    }
    if (store.world.image && store.world.image !== worldData.image) {
      newWorldData.image = store.world.image;
    }

    if (JSON.stringify(newWorldData) !== JSON.stringify(worldData)) {
      setWorldData(newWorldData);
    }
  }, [store.world, worldData]);

  const blankCampaign = {
    name: "",
    description: "",
    image: "",
    readers: [session.user?.email],
    writers: [session.user?.email],
    admins: [session.user?.email],
    public: false,
    entries: [],
  };

  const onDelete = async () => {
    try {
      await fetch("/api/world/delete", {
        method: "POST",
        body: JSON.stringify({ worldID: world.id }),
      });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.log("error deleting world: ", error);
    }
  };

  const onSave = async () => {
    try {
      await fetch("/api/world/update", {
        method: "POST",
        body: JSON.stringify({
          worldData,
        }),
      });
      router.refresh();
    } catch (error) {
      console.log("error updating world: ", error);
    }
  };

  const onCreateCampaign = async () => {
    try {
      await fetch("/api/campaign/create", {
        method: "POST",
        body: JSON.stringify({
          campaignData: blankCampaign,
          worldID: world.id,
          permissions,
        }),
      }).then((res) =>
        res.json().then((campaignID: string) => {
          router.push(`/world/${world.id}/campaign/${campaignID}`);
          router.refresh();
        }),
      );
    } catch (error) {
      console.log("error submitting campaign: ", error);
    }
  };

  const onImageUpload = async (uploadedFile: File) => {
    try {
      const base64: string = await base64Converter(uploadedFile);
      const filePath = `worlds/${world.id}/image`;
      await fetch("/api/image/create", {
        method: "POST",
        body: JSON.stringify({
          base64,
          filePath,
          worldID: world.id,
        }),
      }).then((res) =>
        res.json().then((url: string) => {
          setWorldData({ ...worldData, image: url });
          router.refresh();
        }),
      );
    } catch (error) {
      console.log("error submitting image: ", error);
    }
  };

  const onImageDelete = async () => {
    try {
      const filePath = `worlds/${world.id}/image`;
      await fetch("/api/image/delete", {
        method: "POST",
        body: JSON.stringify({
          filePath,
          worldID: world.id,
        }),
      }).then(() => {
        setWorldData({ ...worldData, image: "" });
        router.refresh();
      });
    } catch (error) {
      console.log("error deleting image: ", error);
    }
  };

  const onImageChange = () => {
    console.log("called to set image");
    setWorldData({ ...worldData, image: store.world.image });
  };

  if (!mounted) {
    return <div className="h-full w-full bg-white" />;
  }

  return (
    <div className="mb-12 flex h-full w-full flex-col">
      <PageHeader<WorldDB>
        data={worldData}
        setData={setWorldData}
        onSave={onSave}
        onDelete={onDelete}
        permissions={permissions}
        session={session}
        contributors={contributors}
      />
      <div className="scrollbar-hide isolate flex grow flex-col items-start gap-6 overflow-y-scroll bg-white p-4 md:gap-10 md:px-16 md:py-6">
        <div className="relative min-h-[352px] w-full rounded-2xl bg-lore-beige-400">
          <div className="absolute bottom-4 right-4 flex">
            <ImageSettings<WorldDB>
              data={worldData}
              setData={setWorldData}
              permissions={permissions}
              onUpload={onImageUpload}
              onDelete={onImageDelete}
            />
          </div>
          {worldData.image && (
            <img
              className="h-full w-full rounded-lg object-cover"
              src={`${worldData.image}?${Date.now()}`}
              alt=""
            />
          )}
        </div>
        <PageBody<WorldDB>
          data={worldData}
          setData={setWorldData}
          permissions={permissions}
        />
        <div className="flex self-stretch bg-lore-beige-500 p-[1px]" />
        <div className="flex w-full flex-col gap-4">
          <div className="flex items-center justify-between gap-4 self-stretch">
            <p className="text-[40px] font-bold">Campaigns</p>
            {permissions.includes("writer") && (
              <button
                className="flex w-[100px] items-center justify-center gap-2 rounded-lg bg-lore-red-400 px-4 py-3 text-white transition-all duration-300 ease-out hover:bg-lore-red-500"
                onClick={() => onCreateCampaign()}
              >
                <MdAdd className="h-5 w-5" />
                <p className="font-medium leading-5">New</p>
              </button>
            )}
          </div>
          <div className="flex flex-col gap-5">
            {campaigns.map((campaign, index) => (
              <div
                className="flex h-40 cursor-pointer items-end justify-between gap-4 self-stretch rounded-2xl bg-cover p-4"
                style={{
                  backgroundImage: `linear-gradient(180deg,rgba(0,0,0,0)0%,rgba(0,0,0,0.75)100%),url(${
                    campaign.image ? campaign.image : "/eryndor.svg"
                  })`,
                }}
                onClick={() =>
                  router.push(`/world/${world.id}/campaign/${campaign.id}`)
                }
                key={index}
              >
                <p className="flex items-end self-stretch font-cinzel text-[40px] font-medium leading-[54px] text-white">
                  {campaign.name ? campaign.name.toUpperCase() : "UNTITLED"}
                </p>
                <div className="flex max-h-28 min-w-max flex-col-reverse flex-wrap-reverse items-end gap-2">
                  {campaign.contributors.map((contributor, index) => (
                    <img
                      className="h-12 w-12 min-w-max rounded-full"
                      src={contributor.image}
                      alt=""
                      key={index}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex h-[72px] w-full" />
        </div>
      </div>
    </div>
  );
};

export default WorldPage;
