"use client";

import { Campaign, Entry } from "@/types";
import { getActiveID } from "@/utils/getActiveID";
import { getIcon } from "@/utils/getIcon";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  children: JSX.Element;
  entries: Entry[];
  campaigns: Campaign[];
  worldID: string;
};

interface FilteredSearch {
  id: string;
  name: string;
  category: string;
  url: string;
}

const NavSearch = ({ children, entries, campaigns, worldID }: Props) => {
  const [searchValue, setSearchValue] = useState("");
  const [filteredSearch, setFilteredSearch] = useState<FilteredSearch[]>([]);

  const router = useRouter();
  const pathname = usePathname();
  const activeID = getActiveID(pathname);

  const unFilteredSearch = (): {
    id: string;
    name: string;
    category: string;
    url: string;
  }[] => {
    const result: {
      id: string;
      name: string;
      category: string;
      url: string;
    }[] = [];
    entries.map((entry: any) =>
      result.push({
        id: entry.id,
        name: entry.name,
        category: entry.category,
        url: `/world/${worldID}/entry/${entry.id}`,
      }),
    );
    campaigns.map((campaign) =>
      result.push({
        id: campaign.id,
        name: campaign.name,
        category: "Campaign",
        url: `/world/${worldID}/campaign/${campaign.id}`,
      }),
    );
    campaigns.map((campaign) =>
      campaign.entries.map((campaignEntry: any) =>
        result.push({
          id: campaignEntry.id,
          name: campaignEntry.name,
          category: campaignEntry.category,
          url: `/world/${worldID}/campaign/${campaign.id}/entry/${campaignEntry.id}`,
        }),
      ),
    );
    return result;
  };

  useEffect(() => {
    const filterSearch = unFilteredSearch().filter((element) => {
      if (element.name.toLowerCase().includes(searchValue.toLowerCase())) {
        return element;
      }
    });
    setFilteredSearch(filterSearch);
  }, [searchValue]);

  return (
    <>
      <div className="mb-[2px] flex items-center justify-between gap-2 self-stretch bg-white py-[18px] px-4 text-lore-blue-400">
        <input
          className="grow leading-5 placeholder:text-lore-blue-400 focus-visible:outline-none"
          placeholder="Search"
          type="search"
          autoComplete="off"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
        {searchValue ? (
          <span
            className="material-icons cursor-pointer"
            onClick={() => setSearchValue("")}
          >
            close
          </span>
        ) : (
          <span className="material-icons-outlined cursor-default">search</span>
        )}
      </div>
      {searchValue ? (
        <div className="h-full gap-4 overflow-y-scroll bg-lore-beige-400 p-4 text-lore-blue-400 scrollbar-hide">
          {filteredSearch.map((element) => (
            <button
              className={`flex items-center gap-2  self-stretch p-2 ${
                element.id === activeID && "text-lore-red-400"
              }`}
              onClick={() => router.push(element.url)}
            >
              {getIcon(element.category, "material-icons-outlined text-[20px]")}
              <p className="flex grow font-medium leading-5">{element.name}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="h-full gap-4 overflow-y-scroll bg-lore-beige-400 p-4 scrollbar-hide">
          {children}
        </div>
      )}
    </>
  );
};

export default NavSearch;
