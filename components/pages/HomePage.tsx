"use client";

import GenieForm from "@/components/GenieForm";
import { Button } from "@/components/ui/button";
import { World } from "@/types";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdEast } from "react-icons/md";
import OutsideClickHandler from "react-outside-click-handler";
import removeMd from "remove-markdown";

type Props = {
  worlds: World[];
  session: Session | null;
};

const HomePage = ({ worlds, session }: Props) => {
  const [genieFormOpen, setGenieFormOpen] = useState(false);
  const email = session?.user?.email as string;
  const router = useRouter();

  const world: Partial<World> = {
    name: "",
    description: "",
    image: "",
    readers: [email],
    writers: [email],
    admins: [email],
    public: false,
    entries: [],
    campaigns: [],
  };

  const onCreate = async (prompt?: string) => {
    try {
      world.prompt = prompt;
      await fetch("/api/world/create", {
        method: "POST",
        body: JSON.stringify(world),
      }).then((res) =>
        res.json().then((worldID: string) => {
          router.push(`/world/${worldID}`);
          router.refresh();
        }),
      );
    } catch (error) {
      console.log("error submitting world: ", error);
    }
  };

  return (
    <>
      <div className="scrollbar-hide flex h-full flex-col justify-between overflow-y-scroll bg-lore-beige-100">
        <img
          className="fixed h-full w-full translate-y-80 object-cover mix-blend-multiply"
          src="/background.svg"
          alt=""
        />
        <div className="z-10 flex flex-col items-center gap-4 p-4 md:gap-6 md:py-12">
          {worlds.map((world, index) => (
            <div
              className="flex h-[360px] w-full cursor-pointer flex-col gap-4 rounded-2xl bg-lore-beige-500 bg-cover p-4 md:h-[400px] md:max-w-[860px] md:justify-end md:p-10"
              style={{
                backgroundImage: `linear-gradient(180deg,rgba(0,0,0,0)0%,rgba(0,0,0,0.75)100%),url(${
                  world.image ? world.image : "/eryndor.svg"
                })`,
              }}
              onClick={() => router.push(`/world/${world.id}`)}
              key={index}
            >
              <div className="flex h-full flex-col-reverse items-end justify-between gap-20 md:flex-row">
                <div className="flex w-full flex-col gap-2 text-white">
                  <p className="flex justify-center text-center font-cinzel text-[40px] font-medium leading-[54px] md:justify-start">
                    {world.name ? world.name.toUpperCase() : "UNTITLED"}
                  </p>
                  <p className="hidden text-lg font-light leading-5 md:line-clamp-6">
                    {removeMd(world.description)}
                  </p>
                </div>
                <div className="flex gap-2 md:flex-col-reverse">
                  {world.contributors.map((contributor, index) => (
                    <div className="h-12 w-12" key={index}>
                      <img
                        className="h-full w-full rounded-full"
                        src={contributor.image}
                        alt=""
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <div
            className='flex h-[360px] w-full cursor-pointer flex-col gap-4 rounded-2xl bg-lore-beige-500 bg-[linear-gradient(0deg,rgba(0,0,0,0.75),rgba(0,0,0,0.75)),url("/create-world-background.png")] bg-cover bg-top p-4 
            md:h-[400px]
            md:max-w-[860px]
            md:justify-end md:bg-[linear-gradient(180deg,rgba(0,0,0,0)0%,rgba(0,0,0,0.75)100%),url("/create-world-background.png")] md:p-10'
            onClick={() =>
              session?.user?.email ? setGenieFormOpen(true) : signIn()
            }
          >
            <div className="flex h-full flex-col justify-between gap-4 self-stretch text-white md:flex-row md:items-end md:gap-20">
              <div className="flex grow flex-col gap-2">
                <p className="flex justify-center text-center font-cinzel text-[40px] font-medium leading-[54px] md:justify-start md:text-left">
                  CREATE A NEW WORLD
                </p>
                <p className="self-stretch text-center text-lg font-light leading-5 md:text-left">
                  Use Lore Genie to create your next world for your next
                  homebrew campaign.
                </p>
              </div>
              <Button size="xl" className="gap-4">
                Get Started
                <MdEast className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 self-stretch px-12 py-6">
          <div className="flex items-center gap-40 self-stretch">
            <div className="flex grow flex-col items-center gap-6 md:flex-row">
              <img className="w-[83px]" src="/lore-genie-logo-2.svg" alt="" />
              <p className="grow text-center text-xs md:text-left">
                All AI-generated content is Copyright 2022 Lore Genie and
                licensed <u>CC-BY</u>.<br />
                Note that we may use content you generate with Lore Genie to
                train and improve future versions of the system.
              </p>
            </div>
          </div>
        </div>
      </div>
      {genieFormOpen && (
        <>
          <OutsideClickHandler
            onOutsideClick={() => setGenieFormOpen(false)}
            display="contents"
          >
            <div className="absolute left-1/2 top-1/2 z-20 w-full -translate-x-1/2 -translate-y-1/2 px-2 md:w-auto">
              <GenieForm
                onCreate={onCreate}
                setOpen={setGenieFormOpen}
                disabled={false}
              />
            </div>
          </OutsideClickHandler>
          <div className="fixed inset-0 z-10 h-full w-full overflow-y-auto bg-gray-600 bg-opacity-50" />
        </>
      )}
    </>
  );
};

export default HomePage;
