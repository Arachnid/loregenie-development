"use server";
import ClientWorldPage from "@/components/pages/ClientWorldPage";
import { getPermissions, getWorld } from "@/lib/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Session, getServerSession } from "next-auth";
import { notFound } from "next/navigation";

interface Props {
  params: {
    worldID: string;
  };
}

export default async function WorldPage({ params }: Props) {
  const session: Session | null = await getServerSession(authOptions);
  const email = session?.user?.email;
  const world = await getWorld(params.worldID, email as string);

  if (!world || !email) {
    notFound();
  }

  const permissions = await getPermissions(email, params.worldID);

  return (
    <>
      <ClientWorldPage
        world={world}
        campaigns={world.campaigns}
        permissions={permissions}
        session={session}
        contributors={world.contributors}
      />
    </>
  );
}
