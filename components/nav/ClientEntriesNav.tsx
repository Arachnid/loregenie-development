"use client";

import NavSearch from "@/components/nav/NavSearch";
import { Campaign, Entry } from "@/types";
import { useRouter } from "next/navigation";
import { MdAdd } from "react-icons/md";

interface Props {
  children: JSX.Element;
  entries: Entry[];
  campaigns: Campaign[];
  worldID: string;
  permissions: string[];
}

const ClientEntriesNav = ({
  children,
  entries,
  campaigns,
  worldID,
  permissions,
}: Props) => {
  const router = useRouter();

  return (
    <div className="w-full">
      <div className="flex h-full flex-col justify-between">
        <NavSearch
          children={children}
          entries={entries}
          campaigns={campaigns}
          worldID={worldID}
        />
        {permissions.includes("writer") && (
          <div className="flex bg-lore-beige-400">
            <button
              className="m-4 flex w-full items-center justify-center gap-2 rounded-lg bg-lore-red-400 px-4 py-3 text-white transition-all duration-300 ease-out hover:bg-lore-red-500"
              onClick={() => router.push(`/world/${worldID}/page/generate`)}
            >
              <MdAdd className="h-5 w-5" />
              <div className="text-[16px] font-medium">Create new page</div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientEntriesNav;
