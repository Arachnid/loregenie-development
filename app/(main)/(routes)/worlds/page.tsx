"use client";
import dynamic from "next/dynamic";
import { useMemo } from "react";

const WorldsPage = () => {
  const Chat = useMemo(
    () => dynamic(() => import("@/components/chat/chat"), { ssr: false }),
    [],
  );
  return (
    <div className="flex h-full flex-col items-center space-y-4">
      <Chat />
    </div>
  );
};

export default WorldsPage;
