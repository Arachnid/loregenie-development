import { Item } from "@/app/(main)/_components/item";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getCampaign } from "@/server/actions/campaigns";
import { useQuery } from "@tanstack/react-query";
import {
  Castle,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Trash,
} from "lucide-react";
import { useSession } from "next-auth/react";

type CampaignItemProps = {
  worldID: string;
  campaignID: string;
  onClick?: () => void;
  onExpand?: () => void;
  active?: boolean;
  expanded?: boolean;
};

export const CampaignItem = ({
  worldID,
  campaignID,
  onClick,
  onExpand,
  active,
  expanded,
}: CampaignItemProps) => {
  const { data: session } = useSession();

  const { data, isLoading } = useQuery({
    queryKey: ["campaigns", campaignID],
    queryFn: () => {
      return getCampaign({
        campaignID,
        worldID,
      });
    },
  });

  if (isLoading) {
    return <Item.Skeleton level={1} />;
  }

  const campaign = data?.data;

  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.stopPropagation();
    onExpand?.();
  };

  const onDelete = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
  };

  const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
  };

  const ChevronIcon = expanded ? ChevronDown : ChevronRight;
  return (
    <div
      onClick={onClick}
      role="button"
      className={cn(
        "group flex min-h-[27px] w-full items-center py-1 pl-6 pr-3 text-sm font-medium text-muted-foreground hover:bg-primary/5",
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

      <Castle className="mr-2 h-[18px] w-[18px] shrink-0 text-muted-foreground" />

      <span className="truncate">{campaign?.name}</span>
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
        <div
          role="button"
          onClick={onCreate}
          className="ml-auto h-full rounded-sm opacity-0 hover:bg-neutral-300 group-hover:opacity-100 dark:hover:bg-neutral-600"
        >
          <Plus className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};
