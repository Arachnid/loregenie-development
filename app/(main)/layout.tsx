import { Navigation } from "@/app/(main)/_components/navigation";
import { ReactNode } from "react";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-full dark:bg-[#1F1F1F]">
      <Navigation />
      <main className="h-full flex-1 overflow-y-auto">
        {/* <SearchCommand /> */}
        {children}
      </main>
    </div>
  );
}
