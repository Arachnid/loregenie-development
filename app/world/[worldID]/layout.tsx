import EntriesNav from "@/components/nav/EntriesNav";
import NavBar from "@/components/nav/NavBar";
import { ClientProvider } from "@/context/ClientContext";
import { getPermissions, getWorld } from "@/lib/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getAllWorlds } from "@/server/actions/world";
import { World } from "@/types";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

interface Props {
  children: JSX.Element;
  params: {
    worldID: string;
  };
}

export default async function Layout({ children, params }: Props) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["worlds"],
    queryFn: getAllWorlds,
  });

  const world: World | undefined = await getWorld(
    params.worldID,
    email as string,
  );

  if (!email || !world) {
    notFound();
  }

  const permissions = await getPermissions(email, world.id);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientProvider>
        <div className="flex h-screen min-w-fit flex-col">
          <NavBar />
          <div className="flex h-full overflow-y-hidden">
            <div className="w-full md:flex md:max-w-fit lg:min-w-[320px]">
              <nav className="flex h-full w-full">
                <EntriesNav
                  worldID={params.worldID}
                  email={session?.user?.email as string}
                  permissions={permissions}
                  world={world}
                />
              </nav>
            </div>
            <div className="w-full md:ml-[2px] md:flex">{children}</div>
            {/*{permissions.includes("writer") && (*/}
            {/*  <div className="flex" hidden={showMenu}>*/}
            {/*    /!* <GenieWand /> *!/*/}
            {/*    <ChatModal user={session.user} />*/}
            {/*  </div>*/}
            {/*)}*/}
          </div>
        </div>
      </ClientProvider>
    </HydrationBoundary>
  );
}
