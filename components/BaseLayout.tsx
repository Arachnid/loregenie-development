"use client";

import NavBar from "@/components/nav/NavBar";
import { ClientProvider } from "@/context/ClientContext";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import ChatModal from "./ChatModal";

interface Props {
  nav: JSX.Element;
  session: Session;
  worldName: string;
  permissions: string[];
  children: ReactNode;
}

export default function BaseLayout({
  nav,
  session,
  worldName,
  permissions,
  children,
}: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const pathname = usePathname();
  console.log({ session });
  useEffect(() => {
    setShowMenu(false);
  }, [pathname]);

  return (
    <ClientProvider>
      <div className="flex h-screen min-w-fit flex-col">
        <NavBar
          session={session}
          worldName={worldName}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
        />
        <div className="flex h-full overflow-y-hidden">
          <div
            className="w-full md:flex md:max-w-fit lg:min-w-[320px]"
            hidden={!showMenu}
          >
            <nav className="flex h-full w-full">{nav}</nav>
          </div>
          <div className="w-full md:ml-[2px] md:flex" hidden={showMenu}>
            {children}
          </div>
          {permissions.includes("writer") && (
            <div className="flex" hidden={showMenu}>
              {/* <GenieWand /> */}
              <ChatModal user={session.user} />
            </div>
          )}
        </div>
      </div>
    </ClientProvider>
  );
}
