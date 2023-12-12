"use client";

import { Check, Copy, Globe } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useOrigin } from "@/hooks/use-origin";
import { updateWorld as updateWorldAction } from "@/server/actions/world";
import { World } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface PublishProps {
  initialData: World;
}

export const Publish = ({ initialData }: PublishProps) => {
  const origin = useOrigin();
  const queryClient = useQueryClient();
  const { mutateAsync: updateWorldMutation } = useMutation({
    mutationFn: updateWorldAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worlds", initialData.id] });
    },
  });

  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const url = `${origin}/preview/${initialData.id}`;

  const onPublish = () => {
    setIsSubmitting(true);

    const promise = updateWorldMutation({
      id: initialData.id,
      public: true,
    })
      .then((resp) => {
        if (resp.error) {
          return Promise.reject();
        }
        return Promise.resolve();
      })
      .finally(() => setIsSubmitting(false));

    toast.promise(promise, {
      loading: "Making world public...",
      success: "World is now public",
      error: "Failed to make world public.",
    });
  };

  const onUnpublish = () => {
    setIsSubmitting(true);

    const promise = updateWorldMutation({
      id: initialData.id,
      public: false,
    })
      .then((resp) => {
        if (resp.error) {
          return Promise.reject();
        }
        return Promise.resolve();
      })
      .finally(() => setIsSubmitting(false));

    toast.promise(promise, {
      loading: "Making world private...",
      success: "World is now private",
      error: "Failed to make world private.",
    });
  };

  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          Publish
          {initialData.public && (
            <Globe className="ml-2 h-4 w-4 text-sky-500" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        {initialData.public ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <Globe className="h-4 w-4 animate-pulse text-sky-500" />
              <p className="text-xs font-medium text-sky-500">
                This world is live on web.
              </p>
            </div>
            <div className="flex items-center">
              <input
                className="h-8 flex-1 truncate rounded-l-md border bg-muted px-2 text-xs"
                value={url}
                disabled
              />
              <Button
                onClick={onCopy}
                disabled={copied}
                className="h-8 rounded-l-none"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              size="sm"
              className="w-full text-xs"
              disabled={isSubmitting}
              onClick={onUnpublish}
            >
              Make Private
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Globe className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="mb-2 text-sm font-medium">Make world public</p>
            <span className="mb-4 text-xs text-muted-foreground">
              Share your world with others.
            </span>
            <Button
              disabled={isSubmitting}
              onClick={onPublish}
              className="w-full text-xs"
              size="sm"
            >
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
