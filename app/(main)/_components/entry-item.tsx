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
import {
  createEntry as createEntryAction,
  deleteEntry as deleteEntryAction,
  getEntry,
} from "@/server/actions/entry";
import { Category } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookOpenText,
  ChevronDown,
  ChevronRight,
  Fingerprint,
  LucideIcon,
  MapPinned,
  MoreHorizontal,
  Plus,
  ShieldQuestion,
  SquareUserRound,
  Trash,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const ENTRY_ICON_MAP: Record<Category, LucideIcon> = {
  Journal: BookOpenText,
  Location: MapPinned,
  Lore: Fingerprint,
  NPC: SquareUserRound,
};

type EntryItemProps = {
  entryID: string;
  worldID: string;
  campaignID?: string;
  active?: boolean;
  expanded?: boolean;
  level?: number;
  onExpand?: () => void;
  onClick?: () => void;
};

export const EntryItem = ({
  entryID,
  campaignID,
  worldID,
  active,
  expanded,
  level,
  onExpand,
  onClick,
}: EntryItemProps) => {
  const { data: session } = useSession();
  const router = useRouter();

  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["entries", entryID],
    queryFn: () => {
      return getEntry({
        entryID,
        campaignID,
        worldID,
      });
    },
  });
  const { mutateAsync: createEntry } = useMutation({
    mutationFn: createEntryAction,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["worlds"] });
      queryClient.invalidateQueries({ queryKey: ["worlds", worldID] });
    },
  });

  const { mutateAsync: deleteEntry } = useMutation({
    mutationFn: deleteEntryAction,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["worlds"] });
      queryClient.invalidateQueries({ queryKey: ["worlds", worldID] });
    },
  });

  if (isLoading) {
    return <Item.Skeleton level={level} />;
  }

  const entry = data?.entry;

  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.stopPropagation();
    onExpand?.();
  };

  const onDelete = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
  };

  const onCreateEntry = (category: Category) => {
    const promise = createEntry({
      worldID,
      category,
      entryID,
      campaignID,
    }).then((resp) => {
      if (resp.error) {
        return Promise.reject();
      }
      if (!expanded) {
        onExpand?.();
      }
      router.push(
        campaignID
          ? `/worlds/${worldID}/campaigns/${campaignID}/entries/${resp.entry?.id}`
          : `/worlds/${worldID}/entries/${resp.entry?.id}`,
      );
    });

    toast.promise(promise, {
      loading: `Creating ${category}...`,
      success: `${category} created`,
      error: `Failed to create ${category}.`,
    });
  };

  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  const Icon = entry?.category
    ? ENTRY_ICON_MAP[entry.category]
    : ShieldQuestion;

  return (
    <div
      onClick={onClick}
      role="button"
      style={{
        paddingLeft: level ? `${level * 12 + 12}px` : "12px",
      }}
      className={cn(
        "group flex min-h-[27px] w-full items-center py-1 pr-3 text-sm font-medium text-muted-foreground hover:bg-primary/5",
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
      <Icon className="mr-2 h-[18px] w-[18px] shrink-0 text-muted-foreground" />

      <span className="truncate">{entry?.name}</span>

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
};
