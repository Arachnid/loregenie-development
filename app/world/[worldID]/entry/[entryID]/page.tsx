import ClientEntryPage from "@/components/pages/ClientEntryPage";
import { getEntry, getPermissions, getWorld } from "@/lib/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { World } from "@/types";
import { getServerSession, Session } from "next-auth";
import { notFound } from "next/navigation";

interface Props {
  params: {
    worldID: string;
    entryID: string;
  };
}

export default async function EntryPage({ params }: Props) {
  const entry = await getEntry(params.worldID, params.entryID);
  const session: Session | null = await getServerSession(authOptions);
  const email = session?.user?.email;
  const world: World | undefined = await getWorld(
    params.worldID,
    email as string,
  );

  if (!entry || !email || !world) {
    notFound();
  }
  const permissions = await getPermissions(email, params.worldID);

  return (
    <ClientEntryPage
      currentEntry={entry}
      world={world}
      entries={world.entries}
      permissions={permissions}
      session={session}
    />
  );
}
