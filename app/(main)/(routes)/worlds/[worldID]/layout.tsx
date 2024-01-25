import chatBg from "@/public/loregenie-chat-bg-2.png";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ReactNode, useMemo } from "react";

export default async function WorldLayout({
  children,
}: {
  children: ReactNode;
}) {
  const Chat = useMemo(
    () => dynamic(() => import("@/components/chat/chat"), { ssr: false }),
    [],
  );
  return (
    <div className="flex h-svh ">
      <div className="h-full flex-1 overflow-auto">{children}</div>
      <aside className="relative h-svh flex-1">
        <div className="absolute inset-0">
          <Image
            src={chatBg}
            alt=""
            layout="fill"
            objectFit="cover"
            objectPosition="center"
          />
        </div>
        <div className="relative h-full w-full overflow-auto">
          <Chat />
        </div>
      </aside>
    </div>
  );
}
