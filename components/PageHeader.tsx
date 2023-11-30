"use client";

import AlertDialog from "@/components/AlertDialog";
import SharingModal from "@/components/SharingModal";
import useStore from "@/hooks/useStore";
import { isEntry, LoreSchemas, User } from "@/types";
import { Session } from "next-auth";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type Props<T extends LoreSchemas> = {
  data: T;
  setData: Dispatch<SetStateAction<T>>;
  onSave: () => Promise<void>;
  onDelete: () => Promise<void>;
  permissions: string[];
  session: Session;
  contributors?: User[];
};

const PageHeader = <T extends LoreSchemas>({
  data,
  setData,
  onSave,
  onDelete,
  permissions,
  session,
  contributors,
}: Props<T>) => {
  const store = useStore();

  const [showModal, setShowModal] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    store.saveToLocalStorage(store.world.id, store.world);
  }, []);

  useEffect(() => {
    const hasChanged =
      JSON.stringify(store.loadFromLocalStorage(store.world.id)) ===
      JSON.stringify(store.world);
    setIsChanged(hasChanged);
  }, [store.world]);

  return (
    <>
      <div className="mb-[2px] flex w-full items-center bg-white py-2 px-4 md:justify-end">
        <div className="flex h-11 w-full items-center gap-4 md:w-auto">
          <div className="hidden h-8 items-center gap-2 overflow-x-clip md:flex">
            {contributors?.map((contributor, index) => (
              <img
                className="h-8 w-8 rounded-full"
                src={contributor.image}
                alt=""
                key={index}
              />
            ))}
          </div>
          <div className="flex w-full min-w-max gap-4 md:w-auto">
            {permissions.includes("admin") && (
              <button
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border-2 border-lore-beige-500 bg-white py-3 px-4 text-[16px] font-medium text-lore-blue-400 transition-all duration-300 ease-out hover:bg-lore-beige-400 md:w-[100px]"
                onClick={() => setShowModal(!showModal)}
              >
                {isEntry(data) ? "Visibility" : "Sharing"}
              </button>
            )}
            {permissions.includes("writer") && (
              <button
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-lore-red-400 py-3 px-4 text-[16px] font-medium text-white transition-all duration-300 ease-out hover:bg-lore-red-500 disabled:opacity-50 disabled:hover:bg-lore-red-400 md:w-[100px]"
                onClick={() => {
                  onSave();
                  window.location.reload();
                }}
                disabled={isChanged}
              >
                Save
              </button>
            )}
            {permissions.includes("admin") && (
              <button
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-lore-red-400 py-3 px-4 text-[16px] font-medium text-white transition-all duration-300 ease-out hover:bg-lore-red-500 md:w-[100px]"
                onClick={() => setAlertOpen(true)}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
      {showModal && (
        <SharingModal
          setShowModal={setShowModal}
          data={data}
          setData={setData}
          session={session}
        />
      )}
      {alertOpen &&
        (isEntry(data) ? (
          <AlertDialog
            title={`Delete ${data.name}?`}
            alertOpen={alertOpen}
            setAlertOpen={setAlertOpen}
            action={onDelete}
          />
        ) : (
          <AlertDialog
            title={"Delete this World?"}
            description={
              "Doing so will permanently delete the data in this world, including all nested entries."
            }
            confirmText={`Confirm that you want to delete this world by typing in its name:`}
            confirmValue={data.name}
            alertOpen={alertOpen}
            setAlertOpen={setAlertOpen}
            action={onDelete}
          />
        ))}
    </>
  );
};

export default PageHeader;
