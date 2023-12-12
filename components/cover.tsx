"use client";

import { ImageIcon, X } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCoverImage } from "@/hooks/use-cover-image";
import { cn } from "@/lib/utils";
import { deleteWorldImage } from "@/server/actions/world";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CoverImageProps {
  worldID: string;
  campaignID?: string;
  entryID?: string;
  url?: string;
  preview?: boolean;
}

export const Cover = ({
  url,
  preview,
  worldID,
  campaignID,
  entryID,
}: CoverImageProps) => {
  const coverImage = useCoverImage();

  const queryClient = useQueryClient();
  const { mutate: deleteImage } = useMutation({
    mutationFn: deleteWorldImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worlds", worldID] });
    },
  });

  const onRemove = async () => {
    deleteImage(worldID);
  };

  return (
    <div
      className={cn(
        "group relative h-[35vh] w-full",
        !url && "h-[12vh]",
        url && "bg-muted",
      )}
    >
      {!!url && <Image src={url} fill alt="Cover" className="object-cover" />}
      {url && !preview && (
        <div className="absolute bottom-5 right-5 flex items-center gap-x-2 opacity-0 group-hover:opacity-100">
          <Button
            onClick={() => coverImage.onReplace(url)}
            className="text-xs text-muted-foreground"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Change cover
          </Button>
          <Button
            onClick={onRemove}
            className="text-xs text-muted-foreground"
            variant="outline"
            size="sm"
          >
            <X className="mr-2 h-4 w-4" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};

Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className="h-[12vh] w-full" />;
};
