import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Markdown from "react-markdown";

export function AssistantMessage({ message }: { message: string }) {
  return (
    <div className="mb-4 flex items-end justify-start">
      <Avatar>
        <AvatarImage alt="" src="/genie-avatar.png" />
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
      <div className="ml-2 rounded-lg bg-gray-200 px-3 py-2 dark:bg-gray-700">
        <p className="text-sm font-semibold">Lore Genie</p>
        <p className="mt-1 leading-5">
          <Markdown className="prose-sm *:*:*:m-0 *:*:m-0 *:m-0">
            {message}
          </Markdown>
        </p>
      </div>
    </div>
  );
}
