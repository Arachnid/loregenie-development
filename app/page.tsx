import NavBar from "@/components/nav/NavBar";
import HomePage from "@/components/pages/HomePage";
import { getWorlds } from "@/lib/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { World } from "@/types";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  let worlds: World[] = [];

  if (session?.user?.email) {
    worlds = await getWorlds(session?.user?.email);
  }

  return (
    <div className="flex h-screen min-w-fit flex-col">
      <NavBar />
      <HomePage worlds={worlds} session={session} />
    </div>
  );
}
