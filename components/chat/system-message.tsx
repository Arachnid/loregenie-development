import { cn } from "@/lib/utils";

export function SystemMessage({ message }: { message: string }) {
  return (
    <div className="mb-4 flex justify-center">
      <div
        className={cn(
          "rounded-lg px-3 py-2 ",
          "bg-lore-red-300 text-lore-red-900",
          "dark:bg-lore-red-700 dark:text-lore-red-100",
        )}
      >
        <p className="mt-1 leading-5">{message}</p>
      </div>
    </div>
  );
}
