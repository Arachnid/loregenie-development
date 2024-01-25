"use client";

import chatBg from "@/public/loregenie-chat-bg-wide-1.png";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useMemo } from "react";

const WorldsPage = () => {
  const Chat = useMemo(
    () => dynamic(() => import("@/components/chat/chat"), { ssr: false }),
    [],
  );
  return (
    <div className="relative h-svh w-full">
      <div className="absolute inset-0">
        <Image
          src={chatBg}
          alt=""
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
      <div className="relative mx-auto h-full w-full max-w-screen-lg overflow-auto">
        <Chat />
      </div>
    </div>
  );
};

export default WorldsPage;
