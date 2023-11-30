"use client";

import ParentDropDown from "@/components/dropdown/ParentDropDown";
import ImageSettings from "@/components/ImageSettings";
import PageBody from "@/components/PageBody";
import PageHeader from "@/components/PageHeader";
import { useClientContext } from "@/hooks/useClientContext";
import {
  Campaign,
  Category,
  Entry,
  EntryHierarchy,
  LoreSchemas,
  World,
} from "@/types";
import { base64Converter } from "@/utils/base64Converter";
import { createEntryHierarchy } from "@/utils/createEntryHierarchy";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  currentEntry: Entry;
  world: World;
  entries: Entry[];
  permissions: string[];
  session: Session;
}

const ClientEntryPage = ({
  currentEntry,
  world,
  entries,
  permissions,
  session,
}: Props) => {
  const [entryData, setEntryData] = useState<Entry>(currentEntry);
  const [mounted, setMounted] = useState(false);
  const { setClient } = useClientContext();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setClient({ world, entry: currentEntry });
  }, [currentEntry]);

  const onDelete = async () => {
    try {
      await fetch("/api/entry/delete", {
        method: "POST",
        body: JSON.stringify({
          entryID: currentEntry.id,
          worldID: world.id,
          campaignID: currentEntry.campaign?.id,
        }),
      });
      router.push(`/world/${world.id}`);
      router.refresh();
    } catch (error) {
      console.log("error deleting entry: ", error);
    }
  };

  const onSave = async () => {
    try {
      await fetch("/api/entry/update", {
        method: "POST",
        body: JSON.stringify({
          entryData,
          worldID: world.id,
        }),
      });
      router.refresh();
    } catch (error) {
      console.log("error updating entry: ", error);
    }
  };

  const onImageUpload = async (uploadedFile: File) => {
    try {
      const base64: string = await base64Converter(uploadedFile);
      const filePath = `worlds/${world.id}/entries/${currentEntry.id}/image`;
      await fetch("/api/image/create", {
        method: "POST",
        body: JSON.stringify({ base64, filePath, worldID: world.id }),
      }).then((res) =>
        res
          .json()
          .then((url: string) => setEntryData({ ...entryData, image: url })),
      );
      router.refresh();
    } catch (error) {
      console.log("error submitting image: ", error);
    }
  };

  const onImageDelete = async () => {
    try {
      const filePath = `worlds/${world.id}/entries/${currentEntry.id}/image`;
      await fetch("/api/image/delete", {
        method: "POST",
        body: JSON.stringify({
          filePath,
          worldID: world.id,
        }),
      }).then(() => {
        setEntryData({ ...entryData, image: "" });
        router.refresh();
      });
    } catch (error) {
      console.log("error deleting image: ", error);
    }
  };

  const getParents = (entries: Entry[]): EntryHierarchy[] => {
    const result: EntryHierarchy[] = [];
    const parentHierarchy: EntryHierarchy[] = createEntryHierarchy(entries);

    const recursiveEntryHierarchy = (entriesHierarchy: EntryHierarchy[]) => {
      entriesHierarchy.map((entry: EntryHierarchy) => {
        if (
          entry.id !== currentEntry.id &&
          (entry.category === Category.Location ||
            entry.category === Category.Journal)
        ) {
          if (entry.children) {
            result.push(entry);
            return recursiveEntryHierarchy(entry.children);
          }
          result.push(entry);
        }
      });
    };
    recursiveEntryHierarchy(parentHierarchy);
    return result;
  };

  const defaultParent = () => {
    if (currentEntry.parent) {
      return currentEntry.parent.name;
    }
    if (currentEntry.campaign) {
      return currentEntry.campaign.name;
    }
    return world.name;
  };

  const generateDropDownList = () => {
    const result: LoreSchemas[] = [];
    if (currentEntry.campaign) {
      result.push(currentEntry.campaign as Campaign);
    } else {
      result.push(world);
    }
    result.push(...getParents(entries));
    return result;
  };

  if (!mounted) {
    return <div className="h-full w-full bg-white" />;
  }

  return (
    <div className="mb-12 flex h-full w-full flex-col">
      <PageHeader<Entry>
        session={session}
        data={entryData}
        setData={setEntryData}
        onSave={onSave}
        onDelete={onDelete}
        permissions={permissions}
      />
      <div className="isolate flex h-full flex-col items-start gap-6 overflow-y-scroll bg-white p-4 scrollbar-hide md:gap-10 md:px-16 md:py-6">
        <div className="flex flex-col-reverse items-start gap-6 self-stretch md:flex-row">
          <div className="flex w-full flex-col items-start gap-4 rounded-lg bg-lore-beige-400 p-6 md:w-auto md:grow">
            <div className="flex flex-col gap-2 self-stretch md:flex-row md:items-center md:gap-4">
              <p className="w-[54px] font-medium">Parent</p>
              <ParentDropDown<LoreSchemas>
                setData={setEntryData}
                data={entryData}
                permissions={permissions}
                dropDownList={generateDropDownList()}
                defaultParent={defaultParent()}
              />
            </div>
            <div className="h-[2px] self-stretch bg-lore-beige-500" />
            <div className="flex flex-col gap-2 self-stretch md:flex-row md:items-center md:gap-4">
              <p className="w-[54px] font-medium">Type</p>
              <div className="flex h-11 grow items-center gap-2 rounded-lg bg-white px-4 py-3">
                {entryData.category}
              </div>
            </div>
          </div>
          <div
            className={`relative flex w-full ${
              !entryData.image && "pb-[100%] xs:pb-[440px]"
            } rounded-lg bg-lore-beige-400 xs:mx-auto xs:w-[440px] md:h-[170px] md:min-h-0 md:w-[170px] md:pb-0`}
          >
            <div className="absolute bottom-2 right-2 flex">
              <ImageSettings<Entry>
                data={entryData}
                setData={setEntryData}
                permissions={permissions}
                onUpload={onImageUpload}
                onDelete={onImageDelete}
              />
            </div>
            {entryData.image && (
              <img
                className="aspect-square h-full w-full rounded-lg object-cover"
                src={`${entryData.image}?${Date.now()}`}
                alt=""
              />
            )}
          </div>
        </div>
        <PageBody<Entry>
          data={entryData}
          setData={setEntryData}
          permissions={permissions}
        />
      </div>
    </div>
  );
};

export default ClientEntryPage;
