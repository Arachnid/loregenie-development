"use client";

import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect } from "react";

type Props = {
  session: Session | null;
  worldName?: string;
  showMenu?: boolean;
  setShowMenu?: Dispatch<SetStateAction<boolean>>;
};

const NavBar = ({ session, worldName, showMenu, setShowMenu }: Props) => {
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
          {worldName && (
            <h2 className="hidden self-center text-xl font-medium leading-6 text-lore-blue-400 md:block">
              {worldName}
            </h2>
          )}
        </div>
        <div className="flex h-8 items-center gap-2 pl-2 text-lore-blue-400 md:gap-4">
          {session ? (
            <button className="hidden md:block" onClick={() => signOut()}>
              Sign Out
            </button>
          ) : (
            <button className="hidden md:block" onClick={() => signIn()}>
              Sign In
            </button>
          )}
          <span className="material-icons-outlined">notifications</span>
          <span className="material-icons-outlined">settings</span>
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
      {setShowMenu && (
        <button
          className="flex w-fit items-center gap-2 text-lore-blue-400 md:hidden"
          onClick={() => setShowMenu(!showMenu)}
        >
          {showMenu ? (
            <span className="material-icons">close</span>
          ) : (
            <span className="material-icons">menu</span>
          )}
          <h2 className="text-xl font-medium leading-6">{worldName}</h2>
        </button>
      )}
    </div>
  );
};

export default NavBar;
