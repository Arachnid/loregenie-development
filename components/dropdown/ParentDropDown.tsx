"use client";

import { Category, Entry, isCampaign, isEntry, LoreSchemas } from "@/types";
import { getIcon } from "@/utils/getIcon";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MdClose, MdExpandLess, MdExpandMore, MdSearch } from "react-icons/md";
import OutsideClickHandler from "react-outside-click-handler";
import { filterLogic } from "./filterLogic";

type Props<T extends LoreSchemas> = {
  setData: Dispatch<SetStateAction<Entry>>;
  data: Entry;
  permissions: string[];
  generate?: boolean;
  dropDownList: T[];
  defaultParent: string;
};

const ParentDropDown = <T extends LoreSchemas>({
  setData,
  data,
  permissions,
  generate,
  dropDownList,
  defaultParent,
}: Props<T>) => {
  const [searchValue, setSearchValue] = useState("");
  const [filteredSearch, setFilteredSearch] = useState<T[]>([]);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [parentDisplay, setParentDisplay] = useState(defaultParent);

  const filterSearch = () => {
    return dropDownList.filter((listIem) => {
      if (listIem.name.toLowerCase().includes(searchValue.toLowerCase())) {
        return listIem;
      }
    });
  };

  const handleIcon = (schema: LoreSchemas): JSX.Element => {
    if (isEntry(schema)) {
      return getIcon(schema.category as Category, "w-5 h-5");
    }
    if (isCampaign(schema)) {
      return getIcon("Campaign", "w-5 h-5");
    }
    return getIcon("Home", "w-5 h-5");
  };

  useEffect(() => {
    setFilteredSearch(filterSearch);
  }, [searchValue]);

  return (
    <OutsideClickHandler
      onOutsideClick={() => setDropDownOpen(false)}
      display="contents"
    >
      <div className="relative flex w-full grow flex-col items-center gap-4 self-stretch">
        <button
          className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 disabled:cursor-default"
          onClick={() => setDropDownOpen(!dropDownOpen)}
          disabled={!permissions.includes("writer")}
        >
          <p className="flex grow">{parentDisplay}</p>
          {permissions.includes("writer") &&
            (dropDownOpen ? (
              <MdExpandLess className="h-5 w-5" />
            ) : (
              <MdExpandMore className="h-5 w-5" />
            ))}
        </button>
        {dropDownOpen && (
          <div className="absolute z-10 mt-12 flex max-h-80 w-full min-w-max flex-col rounded-lg border-2 border-lore-beige-500 bg-white shadow-[0px_5px_10px_rgba(0,0,0,0.15)]">
            <div className="flex items-center justify-center self-stretch border-b-2 border-lore-beige-500 px-4 py-3">
              <input
                className="grow leading-5 placeholder:text-black focus-visible:outline-none"
                placeholder="Search"
                value={searchValue}
                onChange={(event) => setSearchValue(event?.target.value)}
              />
              {searchValue ? (
                <MdClose
                  className="h-5 w-5 cursor-pointer"
                  onClick={() => setSearchValue("")}
                />
              ) : (
                <MdSearch className="h-5 w-5 cursor-pointer" />
              )}
            </div>
            <div className="scrollbar-hide flex grow flex-col self-stretch overflow-y-scroll p-2">
              <div className="flex grow flex-col self-stretch text-lore-blue-400">
                {filteredSearch.map((schema: any, index) => (
                  <button
                    className="flex items-center gap-2 self-stretch rounded-lg p-2 transition-all duration-300 ease-out hover:bg-lore-beige-300"
                    onClick={() => {
                      filterLogic(generate, schema, data, setData);
                      setParentDisplay(() => schema.name);
                      setDropDownOpen(false);
                    }}
                    key={index}
                  >
                    {handleIcon(schema)}
                    <p className="flex grow font-medium leading-5">
                      {schema.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </OutsideClickHandler>
  );
};

export default ParentDropDown;
