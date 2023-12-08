"use client";

import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/use-settings";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
import { MdOutlineNotifications, MdOutlineSettings } from "react-icons/md";

const NavBar = () => {
  const { data: session, status } = useSession();
  const settings = useSettings();

  const userData = {
    image: session?.user?.image as string,
    email: session?.user?.email as string,
    username: session?.user?.name as string,
  };

  const onSignIn = async () => {
    try {
      await fetch("/api/user/update", {
        method: "POST",
        body: JSON.stringify({ userData }),
      });
    } catch (error) {
      console.log("error updating user: ", error);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      onSignIn();
    }
  }, [session]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex min-w-max items-center justify-between">
        <div className="flex h-6 items-center gap-6">
          <Link className="h-5" href="/">
            <img src={"/lore-genie-logo.svg"} alt="Lore Genie" />
          </Link>
        </div>
        <div className="flex h-8 items-center gap-2 pl-2 text-lore-blue-400 md:gap-4">
          {session ? (
            <Button className="hidden md:block" onClick={() => signOut()}>
              Sign Out
            </Button>
          ) : (
            <Button className="hidden md:block" onClick={() => signIn()}>
              Sign In
            </Button>
          )}
          <MdOutlineNotifications className="h-6 w-6" />
          <Button variant="ghost" size="icon" onClick={settings.onOpen}>
            <MdOutlineSettings className="h-6 w-6" />
          </Button>
          <img
            className="h-8 w-8 rounded-full"
            src={
              session?.user?.image
                ? session.user.image
                : "/no-profile-picture.svg"
            }
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
