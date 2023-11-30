"use client";

import Contributor from "@/components/Contributor";
import PermissionDropDown from "@/components/dropdown/PermissionDropDown";
import { CampaignDB, isEntry, LoreSchemas, User, WorldDB } from "@/types";
import { Session } from "next-auth";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MdAdd, MdClose, MdLink } from "react-icons/md";
import OutsideClickHandler from "react-outside-click-handler";

type Props<T extends LoreSchemas> = {
  setShowModal: Dispatch<React.SetStateAction<boolean>>;
  data: T;
  setData: Dispatch<SetStateAction<T>>;
  session: Session;
};

const SharingModal = <T extends LoreSchemas>({
  setShowModal,
  data,
  setData,
  session,
}: Props<T>) => {
  const [publicSwitchOn, setPublicSwitchOn] = useState<boolean>(data.public);
  const [inputEmail, setInputEmail] = useState<string>("");
  const [inputPermission, setInputPermission] = useState<string>("Reader");
  const [users, setUsers] = useState<User[]>([]);

  const getUsers = async (emails: string[]) => {
    try {
      let result: User[] = [];
      await fetch("/api/user/get", {
        method: "POST",
        body: JSON.stringify({ emails }),
      }).then((res) =>
        res.json().then((users: User[]) => {
          result = users;
        }),
      );
      return result;
    } catch (error) {
      console.log("error fetching users: ", error);
    }
  };

  useEffect(() => {
    if (!isEntry(data) && data.readers.length) {
      const setUserData = async () => {
        const users = (await getUsers(data.readers)) as User[];
        setUsers(users);
      };
      setUserData();
    }
  }, [!isEntry(data) && data.readers]);

  const onAdd = async () => {
    const validUser = await getUsers([inputEmail]);
    if (!validUser?.length) {
      return alert("User with that email does not exist.");
    }
    if (!isEntry(data)) {
      switch (inputPermission) {
        case "Admin":
          setData({
            ...data,
            admins: [...new Set([...data.admins, inputEmail])],
            writers: [...new Set([...data.writers, inputEmail])],
            readers: [...new Set([...data.readers, inputEmail])],
          });
          break;
        case "Writer":
          setData({
            ...data,
            writers: [...new Set([...data.writers, inputEmail])],
            readers: [...new Set([...data.readers, inputEmail])],
          });
          break;
        case "Reader":
          setData({
            ...data,
            readers: [...new Set([...data.readers, inputEmail])],
          });
          break;
        default:
          break;
      }
    }
    setInputEmail("");
  };

  return (
    <>
      <OutsideClickHandler
        onOutsideClick={() => setShowModal(false)}
        display="contents"
      >
        <div className="absolute left-1/2 top-1/2 z-20 w-[97%] min-w-max -translate-x-1/2 -translate-y-1/2 rounded-lg bg-lore-beige-400 md:w-[571px]">
          <div className="flex items-center justify-center gap-2 self-stretch rounded-t-lg bg-lore-beige-500 px-6 py-4">
            <p className="grow text-2xl font-medium leading-7">
              {isEntry(data) ? "Visibility" : "Sharing settings"}
            </p>
            <MdClose
              className="h-5 w-5 cursor-pointer"
              onClick={() => setShowModal(false)}
            />
          </div>
          <div className="flex flex-col gap-6 self-stretch p-6">
            <div className="flex flex-col gap-2 self-stretch md:flex-row">
              <div className="flex grow items-center justify-center gap-2 rounded-lg bg-white py-2 pl-4 pr-2">
                <p className="grow leading-5">Make public</p>
                <button
                  className={`flex items-center ${
                    publicSwitchOn && "justify-end"
                  } h-7 w-12 gap-2 rounded-full border-2 border-lore-beige-500 p-[2px]`}
                  onClick={() => {
                    setData({ ...data, public: !data.public });
                    setPublicSwitchOn(!publicSwitchOn);
                  }}
                >
                  <div
                    className={`h-5 w-5 rounded-full ${
                      publicSwitchOn ? "bg-lore-blue-400" : "bg-lore-gray-100"
                    }`}
                  />
                </button>
              </div>
              <button
                className="flex items-center justify-center gap-2 rounded-lg border-2 border-lore-beige-500 bg-white px-4 py-3 text-lore-blue-400"
                onClick={() =>
                  navigator.clipboard
                    .writeText(window.location.href)
                    .then(() => alert("link copied!"))
                }
              >
                <MdLink className="h-5 w-5" />
                <p className="font-medium leading-5">Copy link</p>
              </button>
            </div>
            {!isEntry(data) && (
              <div className="flex flex-col items-center justify-center gap-2 self-stretch">
                <p className="self-stretch text-2xl font-medium leading-7">
                  Contributors
                </p>
                {users.map((contributor, index) => {
                  if (data.admins.includes(contributor.email)) {
                    return (
                      <Contributor<WorldDB | CampaignDB>
                        key={index}
                        email={contributor.email}
                        image={contributor.image}
                        title="Admin"
                        data={data}
                        setData={
                          setData as Dispatch<
                            SetStateAction<WorldDB | CampaignDB>
                          >
                        }
                        session={session}
                      />
                    );
                  } else if (data.writers.includes(contributor.email)) {
                    return (
                      <Contributor<WorldDB | CampaignDB>
                        key={index}
                        email={contributor.email}
                        image={contributor.image}
                        title="Writer"
                        data={data}
                        setData={
                          setData as Dispatch<
                            SetStateAction<WorldDB | CampaignDB>
                          >
                        }
                        session={session}
                      />
                    );
                  } else {
                    return (
                      <Contributor<WorldDB | CampaignDB>
                        key={index}
                        email={contributor.email}
                        image={contributor.image}
                        title="Reader"
                        data={data}
                        setData={
                          setData as Dispatch<
                            SetStateAction<WorldDB | CampaignDB>
                          >
                        }
                        session={session}
                      />
                    );
                  }
                })}
                <div className="flex flex-col gap-2 self-stretch md:flex-row">
                  <input
                    className="flex h-11 grow items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 placeholder:text-black placeholder:text-opacity-50 focus-visible:outline-none"
                    type="email"
                    placeholder="Enter email"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <PermissionDropDown
                      title={inputPermission}
                      adminAction={() => setInputPermission("Admin")}
                      writerAction={() => setInputPermission("Writer")}
                      readerAction={() => setInputPermission("Reader")}
                    />
                    <button
                      className="flex h-11 items-center justify-center gap-2 rounded-lg border-2 border-lore-beige-500 bg-white px-4 py-3 text-lore-blue-400"
                      onClick={() => onAdd()}
                    >
                      <MdAdd className="h-5 w-5" />
                      <p className="font-medium leading-5">Add</p>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </OutsideClickHandler>
      <div className="fixed inset-0 z-10 h-full w-full overflow-y-auto bg-gray-600 bg-opacity-50" />
    </>
  );
};

export default SharingModal;
