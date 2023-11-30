"use client";

import { useState } from "react";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import OutsideClickHandler from "react-outside-click-handler";

type Props = {
  title: string;
  adminAction: () => void;
  writerAction: () => void;
  readerAction: () => void;
};

const PermissionDropDown = ({
  title,
  adminAction,
  writerAction,
  readerAction,
}: Props) => {
  const [dropDownOpen, setDropDownOpen] = useState(false);

  return (
    <OutsideClickHandler
      onOutsideClick={() => setDropDownOpen(false)}
      display="contents"
    >
      <div className="relative flex w-full flex-col text-lore-blue-400 md:w-[140px]">
        <button
          className="flex justify-center gap-2 rounded-lg bg-white px-4 py-3"
          onClick={() => setDropDownOpen(!dropDownOpen)}
        >
          <p className="flex grow leading-5">{title}</p>
          {dropDownOpen ? (
            <MdExpandLess className="h-5 w-5" />
          ) : (
            <MdExpandMore className="h-5 w-5" />
          )}
        </button>
        {dropDownOpen && (
          <div className="absolute z-30 mt-12 flex w-full min-w-max flex-col rounded-lg border-2 border-lore-beige-500 bg-white shadow-[0px_5px_10px_rgba(0,0,0,0.15)]">
            {title !== "Admin" && (
              <button
                className="flex rounded-lg px-4 py-3 leading-5 transition-all duration-300 ease-out hover:bg-lore-beige-300"
                onClick={() => {
                  adminAction();
                  setDropDownOpen(false);
                }}
                id="contributor"
              >
                Admin
              </button>
            )}
            {title !== "Writer" && (
              <button
                className="flex rounded-lg px-4 py-3 leading-5 transition-all duration-300 ease-out hover:bg-lore-beige-300"
                onClick={() => {
                  writerAction();
                  setDropDownOpen(false);
                }}
                id="contributor"
              >
                Writer
              </button>
            )}
            {title !== "Reader" && (
              <button
                className="flex rounded-lg px-4 py-3 leading-5 transition-all duration-300 ease-out hover:bg-lore-beige-300"
                onClick={() => {
                  readerAction();
                  setDropDownOpen(false);
                }}
                id="contributor"
              >
                Reader
              </button>
            )}
          </div>
        )}
      </div>
    </OutsideClickHandler>
  );
};

export default PermissionDropDown;
