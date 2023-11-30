import NavBar from "@/components/nav/NavBar";
import HomePage from "@/components/pages/HomePage";
import { getWorlds } from "@/lib/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { World } from "@/types";
import { Inter } from "@next/font/google";
import { getServerSession } from "next-auth";

const inter = Inter({ subsets: ["latin"] });

export default async function Home() {
  const session = await getServerSession(authOptions);
  let worlds: World[] = [];

  if (session?.user?.email) {
    worlds = await getWorlds(session?.user?.email);
  }

  return (
    <div className="flex h-screen min-w-fit flex-col">
      <NavBar session={session} />
      <HomePage worlds={worlds} session={session} />
    </div>
  );
}
