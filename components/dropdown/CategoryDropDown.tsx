"use client";

import { Category, Entry } from "@/types";
import { getIcon } from "@/utils/getIcon";
import { Dispatch, SetStateAction, useState } from "react";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import OutsideClickHandler from "react-outside-click-handler";

type Props = {
  setData: Dispatch<SetStateAction<Entry>>;
  data: Entry;
  permissions: string[];
  children?: JSX.Element;
  generate?: boolean;
};

const CategoryDropDown = ({ setData, data, permissions }: Props) => {
  const [dropDownOpen, setDropDownOpen] = useState(false);

  return (
    <OutsideClickHandler
      onOutsideClick={() => setDropDownOpen(false)}
      display="contents"
    >
      <div className="relative flex w-full flex-col items-center gap-4 self-stretch">
        <button
          className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 disabled:cursor-default"
          onClick={() => setDropDownOpen(!dropDownOpen)}
          disabled={!permissions.includes("writer")}
        >
          <p className="flex grow">
            {data.category ? data.category : "Select one"}
          </p>
          {permissions.includes("writer") &&
            (dropDownOpen ? (
              <MdExpandLess className="h-5 w-5" />
            ) : (
              <MdExpandMore className="h-5 w-5" />
            ))}
        </button>
        {dropDownOpen && (
          <div className="absolute z-10 mt-12 flex w-full min-w-max flex-col rounded-lg border-2 border-lore-beige-500 bg-white shadow-[0px_5px_10px_rgba(0,0,0,0.15)]">
            <div className="scrollbar-hide flex grow flex-col self-stretch overflow-y-scroll p-2">
              <div className="flex grow flex-col self-stretch text-lore-blue-400">
                {data.campaign ? (
                  <button
                    className="flex items-center gap-2 self-stretch rounded-lg p-2 transition-all duration-300 ease-out hover:bg-lore-beige-300"
                    onClick={() => {
                      setData({ ...data, category: Category.Journal });
                      setDropDownOpen(false);
                    }}
                  >
                    {getIcon(Category.Journal, "w-5 h-5")}
                    <p className="flex grow font-medium leading-5">
                      {Category.Journal}
                    </p>
                  </button>
                ) : (
                  <>
                    {[Category.Location, Category.NPC, Category.Lore].map(
                      (category, index) => (
                        <button
                          className="flex items-center gap-2 self-stretch rounded-lg p-2 transition-all duration-300 ease-out hover:bg-lore-beige-300"
                          onClick={() => {
                            setData({ ...data, category });
                            setDropDownOpen(false);
                          }}
                          key={index}
                        >
                          {getIcon(category, "w-5 h-5")}
                          <p className="flex grow font-medium leading-5">
                            {category}
                          </p>
                        </button>
                      ),
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </OutsideClickHandler>
  );
};

export default CategoryDropDown;
