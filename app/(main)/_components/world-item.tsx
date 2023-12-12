import { ENTRY_ICON_MAP } from "@/app/(main)/_components/entry-item";
import { Item } from "@/app/(main)/_components/item";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { createCampaign as createCampaignAction } from "@/server/actions/campaigns";
import { createEntry as createEntryAction } from "@/server/actions/entry";
import { getWorld } from "@/server/actions/world";
import { Category } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Castle,
  ChevronDown,
  ChevronRight,
  Globe2,
  MoreHorizontal,
  Plus,
  Trash,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type WorldItemsProps = {
  worldID: string;
  onClick?: () => void;
  onExpand?: () => void;
  active?: boolean;
  expanded?: boolean;
};

export function WorldItem({
  worldID,
  onClick,
  onExpand,
  active,
  expanded,
}: WorldItemsProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["worlds", worldID],
    queryFn: () => {
      return getWorld(worldID);
    },
  });
  const queryClient = useQueryClient();
  const { mutateAsync: createCampaign } = useMutation({
    mutationFn: createCampaignAction,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["worlds"] });
      queryClient.invalidateQueries({ queryKey: ["worlds", worldID] });
    },
  });
  const { mutateAsync: createEntry } = useMutation({
    mutationFn: createEntryAction,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["worlds"] });
      queryClient.invalidateQueries({ queryKey: ["worlds", worldID] });
    },
  });

  if (isLoading) {
    return <Item.Skeleton level={0} />;
  }

  const world = data?.data;

  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.stopPropagation();
    onExpand?.();
  };

  const onDelete = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
  };

  const onCreateCampaign = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.stopPropagation();

    const promise = createCampaign({
      worldID,
    }).then((resp) => {
      if (resp.error) {
        return Promise.reject();
      }
      if (!expanded) {
        onExpand?.();
      }
      router.push(`/worlds/${worldID}/campaigns/${resp.data?.id}`);
    });

    toast.promise(promise, {
      loading: "Creating campaign...",
      success: "Campaign created",
      error: "Failed to create campaign.",
    });
  };

  const onCreateEntry = (category: Category) => {
    const promise = createEntry({
      worldID,
      category,
    }).then((resp) => {
      if (resp.error) {
        return Promise.reject();
      }
      if (!expanded) {
        onExpand?.();
      }
      router.push(`/worlds/${worldID}/entries/${resp.entry?.id}`);
    });

    toast.promise(promise, {
      loading: `Creating ${category}...`,
      success: `${category} created`,
      error: `Failed to create ${category}.`,
    });
  };

  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  return (
    <div
      onClick={onClick}
      role="button"
      className={cn(
        "group flex min-h-[27px] w-full items-center py-1 pl-3 pr-3 text-sm font-medium text-muted-foreground hover:bg-primary/5",
        active && "bg-primary/5 text-primary",
      )}
    >
      <div
        role="button"
        className="mr-1 h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
        onClick={handleExpand}
      >
        <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
      </div>

      <Globe2 className="mr-2 h-[18px] w-[18px] shrink-0 text-muted-foreground" />

      <span className="truncate">{world?.name}</span>
      <div className="ml-auto flex items-center gap-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
            <div
              role="button"
              className="ml-auto h-full rounded-sm opacity-0 hover:bg-neutral-300 group-hover:opacity-100 dark:hover:bg-neutral-600"
            >
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-60"
            align="start"
            side="right"
            forceMount
          >
            <DropdownMenuItem onClick={onDelete}>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="p-2 text-xs text-muted-foreground">
              Last edited by: {session?.user?.name || session?.user?.email}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
            <div
              role="button"
              className="ml-auto h-full rounded-sm opacity-0 hover:bg-neutral-300 group-hover:opacity-100 dark:hover:bg-neutral-600"
            >
              <Plus className="h-4 w-4 text-muted-foreground" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-60"
            align="start"
            side="right"
            forceMount
          >
            <DropdownMenuItem onClick={onCreateCampaign}>
              <Castle className="mr-2 h-4 w-4" />
              Create Campaign
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Create Entry</DropdownMenuLabel>
            {(Object.keys(Category) as Array<keyof typeof Category>).map(
              (category) => {
                const Icon = ENTRY_ICON_MAP[category];
                return (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => {
                      onCreateEntry(category as Category);
                    }}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {category}
                  </DropdownMenuItem>
                );
              },
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
