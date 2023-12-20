"use client";

import { ImageIcon } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

import { Button } from "@/components/ui/button";
import { useCoverImage } from "@/hooks/use-cover-image";

import { updateCampaign as updateCampaignAction } from "@/server/actions/campaigns";
import { updateEntry as updateEntryAction } from "@/server/actions/entry";
import { updateWorld as updateWorldAction } from "@/server/actions/world";
import { WorldOrCampaignOrEntry } from "@/types";
import { isCampaign, isEntry } from "@/utils/typeGuards";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ToolbarProps {
  initialData: WorldOrCampaignOrEntry;
  preview?: boolean;
}

export const Toolbar = ({ initialData, preview }: ToolbarProps) => {
  const inputRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(
    initialData.initialData.name || "Untitled",
  );

  const queryClient = useQueryClient();

  const { mutate: updateWorld } = useMutation({
    mutationFn: updateWorldAction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["worlds", initialData.initialData.id],
      });
    },
  });

  const { mutate: updateEntry } = useMutation({
    mutationFn: updateEntryAction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["entries", initialData.initialData.id],
      });
    },
  });

  const { mutate: updateCampaign } = useMutation({
    mutationFn: updateCampaignAction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["campaigns", initialData.initialData.id],
      });
    },
  });

  const coverImage = useCoverImage();

  const enableInput = () => {
    if (preview) return;

    setIsEditing(true);
    setTimeout(() => {
      setValue(initialData.initialData.name);
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => setIsEditing(false);

  const onInput = (value: string) => {
    setValue(value);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      disableInput();
    }
  };

  const onSave = () => {
    if (isCampaign(initialData)) {
      updateCampaign({
        worldID: initialData.worldID,
        campaignID: initialData.campaignID,
        campaignData: {
          name: value || "Untitled",
        },
      });
    } else if (isEntry(initialData)) {
      updateEntry({
        worldID: initialData.worldID,
        entryID: initialData.entryID,
        entryData: {
          name: value || "Untitled",
        },
      });
    } else {
      updateWorld({
        id: initialData.initialData.id,
        name: value || "Untitled",
      });
    }
  };

  return (
    <div className="group relative pl-[54px]">
      <div className="flex items-center gap-x-1 py-4 opacity-0 group-hover:opacity-100">
        {!initialData.initialData.image && !preview && (
          <Button
            onClick={coverImage.onOpen}
            className="text-xs text-muted-foreground"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Add cover
          </Button>
        )}
      </div>
      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(e) => onInput(e.target.value)}
          className="resize-none break-words bg-transparent text-5xl font-bold text-[#3F3F3F] outline-none dark:text-[#CFCFCF]"
        />
      ) : (
        <div
          onClick={enableInput}
          className="break-words pb-[11.5px] text-5xl font-bold text-[#3F3F3F] outline-none dark:text-[#CFCFCF]"
        >
          {initialData.initialData.name || "Untitled"}
        </div>
      )}
    </div>
  );
};
