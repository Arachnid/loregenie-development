"use client";

import useStore from "@/hooks/useStore";
import { LoreSchemas } from "@/types";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";

type Props<T extends LoreSchemas> = {
  data: T;
  setData: Dispatch<SetStateAction<T>>;
  permissions: string[];
  onUpload: (uploadedFile: File) => Promise<void>;
  onDelete: () => Promise<void>;
};

const ImageSettings = <T extends LoreSchemas>({
  data,
  setData,
  permissions,
  onUpload,
  onDelete,
}: Props<T>) => {
  const [editImage, setEditImage] = useState(false);
  const [processing, setProcessing] = useState<boolean>(false);

  const uploadImageRef = useRef<HTMLInputElement>(null);
  const store = useStore();

  const handleUpload = () => {
    if (uploadImageRef.current) {
      uploadImageRef.current.click();
    }
  };

  const generateNewImage = async () => {
    try {
      console.log({ promptimg: data.imagePrompt });
      setProcessing(true);
      const response = await fetch("/api/openAi/generateImage", {
        method: "POST",
        body: JSON.stringify({ prompt: data.imagePrompt, size: "1792x1024" }),
      });

      if (!response.ok) {
        throw new Error("Data fetching failed");
      }
      const result = await response.json();
      setProcessing(false);

      data.image = result;

      store.setWorld({ ...store.world, image: result });

      console.log({ result });
    } catch (error: any) {
      setProcessing(false);
      console.log(error.message);
    }
  };

  return (
    <OutsideClickHandler
      onOutsideClick={() => setEditImage(false)}
      display="contents"
    >
      {editImage && (
        <div className="absolute flex w-[200px] -translate-x-[200px] flex-col gap-2 rounded-lg border-2 border-lore-beige-500 bg-white p-2">
          <button
            className="flex items-center justify-center gap-2 self-stretch rounded-lg bg-lore-blue-400 px-4 py-3 text-white transition-all duration-300 ease-out hover:bg-lore-blue-500 disabled:opacity-50 disabled:hover:bg-lore-blue-400"
            // {data.imagePrompt && 'disabled': ''}}
            onClick={() => {
              generateNewImage();
            }}
          >
            {" "}
            {!processing ? (
              <>
                <span className="material-icons text-[20px]">
                  auto_fix_high
                </span>
                <p className="font-medium leading-5">Generate new</p>
              </>
            ) : (
              <p className="font-medium leading-5">Generating... </p>
            )}
          </button>
          <input
            type="file"
            ref={uploadImageRef}
            accept="image/png, image/jpeg"
            onChange={(e) => {
              if (e.target.files) {
                onUpload(e.target.files[0]);
              }
              setEditImage(false);
            }}
            hidden
          />
          <button
            className="flex items-center justify-center gap-2 self-stretch rounded-lg bg-lore-blue-400 px-4 py-3 text-white transition-all duration-300 ease-out hover:bg-lore-blue-500"
            onClick={() => handleUpload()}
          >
            <span className="material-icons text-[20px]">add</span>
            <p className="font-medium leading-5">Upload new</p>
          </button>
          {data.image && (
            <button
              className="flex h-11 items-center justify-center gap-2 self-stretch rounded-lg border-2 border-lore-beige-500 bg-white px-4 py-3 text-lore-blue-400 transition-all duration-300 ease-out hover:bg-lore-beige-400"
              onClick={() => {
                onDelete();
                setEditImage(false);
              }}
            >
              <span className="material-icons text-[20px]">close</span>
              <p className="font-medium leading-5">Remove</p>
            </button>
          )}
        </div>
      )}
      {permissions.includes("writer") && (
        <button
          className="flex h-11 w-11 items-center justify-center gap-2 rounded-full bg-lore-red-400 p-3 transition-all duration-300 ease-out hover:bg-lore-red-500"
          onClick={() => setEditImage(!editImage)}
        >
          <span className="material-icons text-[20px] text-white">
            more_vert
          </span>
        </button>
      )}
    </OutsideClickHandler>
  );
};

export default ImageSettings;
