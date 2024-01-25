"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import {
  ImageGenerationForm,
  ImageGenerationFormValues,
} from "@/components/forms/ImageGenerationForm";
import { SingleImageDropzone } from "@/components/single-image-dropzone";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useCoverImage } from "@/hooks/use-cover-image";
import { updateEntry as updateEntryAction } from "@/server/actions/entry";
import { createImage } from "@/server/actions/images";
import { updateWorld as updateWorldAction } from "@/server/actions/world";
import { isString } from "@/utils/typeGuards";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const CoverImageModal = () => {
  const params = useParams();
  const coverImage = useCoverImage();

  const worldID = isString(params?.worldID) ? params.worldID : undefined;
  const entryID = isString(params?.entryID) ? params.entryID : undefined;

  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();

  const { mutateAsync: updateWorldMutation } = useMutation({
    mutationFn: updateWorldAction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["worlds", worldID],
      });
    },
  });

  const { mutateAsync: updateEntry } = useMutation({
    mutationFn: updateEntryAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries", entryID] });
    },
  });

  const createImageMutation = useMutation({
    mutationFn: createImage,
    onSuccess: (data) => {
      const image = data?.data?.url;

      if (coverImage && worldID) {
        if (entryID) {
          updateEntry({
            worldID,
            entryID,
            entryData: {
              image: image,
            },
          }).then(() => {
            coverImage.onClose();
          });
        } else {
          updateWorldMutation({
            id: worldID,
            image,
          }).then(() => {
            coverImage.onClose();
          });
        }
      }
    },
  });

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  };

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);

      // const res = await edgestore.publicFiles.upload({
      //   file,
      //   options: {
      //     replaceTargetUrl: coverImage.url
      //   }
      // });
      //
      // await update({
      //   id: params.documentId as Id<"documents">,
      //   coverImage: res.url
      // });

      onClose();
    }
  };

  const onSubmit = async (values: ImageGenerationFormValues) => {};

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>
        <ImageGenerationForm
          onSubmit={(values) => {
            console.log("wat", values, worldID);
            if (worldID) {
              createImageMutation.mutate({
                prompt: values.prompt,
                worldID,
                entryID,
                size: "1792x1024",
              });
            }
          }}
        />
        <SingleImageDropzone
          className="mt-6 w-full outline-none"
          disabled={isSubmitting || createImageMutation.isPending}
          value={file}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  );
};
