"use client";
import backgroundImage from "@/public/create-world-background.png";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { createWorld } from "@/server/actions/world";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

const WorldsPage = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const queryClient = useQueryClient();

  const { mutateAsync: createWorldMutation } = useMutation({
    mutationFn: createWorld,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worlds"] });
    },
  });

  const onCreate = () => {
    const promise = createWorldMutation().then((resp) => {
      if (resp?.status === 200) {
        router.push(`/worlds/${resp?.data?.worldID}`);
      } else {
        throw new Error("Failed to create a new world.");
      }
    });

    toast.promise(promise, {
      loading: "Creating a new world...",
      success: "New world created!",
      error: "Failed to create a new world.",
    });
  };

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <Image src={backgroundImage} alt="" height={300} />
      <h2 className="text-lg font-medium">
        Welcome to {session?.user?.name || session?.user?.email}&apos;s Worlds
      </h2>
      <Button onClick={onCreate}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Create a World
      </Button>
    </div>
  );
};

export default WorldsPage;
