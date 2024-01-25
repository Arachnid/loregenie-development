import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

export function UserMessage({ message }: { message: string }) {
  const { data } = useSession();

  return (
    <div className="mb-4 flex items-end justify-end">
      <div
        className={cn(
          "  mr-2 min-w-56 rounded-lg px-3 py-2 ",
          "text-lore-red-100 bg-lore-red-700",
          "dark:text-lore-red-100 dark:bg-lore-red-400",
        )}
      >
        <p className="text-sm font-semibold">
          {data?.user?.name || data?.user?.email || "You"}
        </p>
        <p className="mt-1 leading-5">{message}</p>
      </div>
      <Avatar>
        <AvatarImage alt="" src={data?.user?.image || undefined} />
        <AvatarFallback>YOU</AvatarFallback>
      </Avatar>
    </div>
  );
}
