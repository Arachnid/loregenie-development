"use client";

import PermissionDropDown from "@/components/dropdown/PermissionDropDown";
import { CampaignDB, WorldDB } from "@/types";
import { Session } from "next-auth";
import { Dispatch, SetStateAction } from "react";

type Props<T extends WorldDB | CampaignDB> = {
  email: string;
  title: string;
  image: string;
  data: T;
  setData: Dispatch<SetStateAction<T>>;
  session: Session;
};

const Contributor = <T extends WorldDB | CampaignDB>({
  email,
  title,
  image,
  data,
  setData,
  session,
}: Props<T>) => {
  return (
    <div className="flex flex-col items-center gap-2 self-stretch md:flex-row">
      <div className="flex w-full items-center gap-2 rounded-lg bg-white p-[10px] pr-4 md:w-auto md:grow">
        <img className="h-6 w-6 rounded-full" src={image} alt="" />
        <p className="grow leading-5">{email}</p>
      </div>
      <div className="flex w-full items-center gap-2 md:w-auto">
        {email === session.user?.email ? (
          <div className="flex w-full flex-col text-lore-blue-400 md:w-[140px]">
            <button
              className="flex h-11 items-center gap-2 rounded-lg bg-white px-4 py-3"
              disabled
            >
              {title}
            </button>
          </div>
        ) : (
          <PermissionDropDown
            title={title}
            adminAction={() =>
              setData({
                ...data,
                admins: [...new Set([...data.admins, email])],
                writers: [...new Set([...data.writers, email])],
                readers: [...new Set([...data.readers, email])],
              })
            }
            writerAction={() =>
              setData({
                ...data,
                admins: data.admins.filter((admin) => email !== admin),
                writers: [...new Set([...data.writers, email])],
                readers: [...new Set([...data.readers, email])],
              })
            }
            readerAction={() =>
              setData({
                ...data,
                admins: data.admins.filter((admin) => email !== admin),
                writers: data.writers.filter((writer) => email !== writer),
                readers: [...new Set([...data.readers, email])],
              })
            }
          />
        )}
        {email === session.user?.email ? (
          <div className="h-5 w-5" />
        ) : (
          <span
            className="material-icons cursor-pointer text-[20px] text-lore-blue-400"
            onClick={() => {
              setData({
                ...data,
                admins: data.admins.filter((admin) => email !== admin),
                writers: data.writers.filter((writer) => email !== writer),
                readers: data.readers.filter((reader) => email !== reader),
              });
            }}
          >
            close
          </span>
        )}
      </div>
    </div>
  );
};

export default Contributor;
