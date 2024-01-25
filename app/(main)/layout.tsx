import { Navigation } from "@/app/(main)/_components/navigation";
import dynamic from "next/dynamic";
import { ReactNode, useMemo } from "react";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const Chat = useMemo(
    () => dynamic(() => import("@/components/chat/chat"), { ssr: false }),
    [],
  );
  return (
    <div className="flex h-svh dark:bg-[#1F1F1F]">
      <div className="h-full overflow-auto">
        <Navigation />
      </div>
      <main className="z-0 h-full flex-1">{children}</main>
    </div>
  );
}
