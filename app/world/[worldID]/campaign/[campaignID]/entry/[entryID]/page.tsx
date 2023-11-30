import ClientEntryPage from "@/components/pages/ClientEntryPage";
import {
  getCampaignEntries,
  getCampaignEntry,
  getPermissions,
  getWorld,
} from "@/lib/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Entry, World } from "@/types";
import { Session, getServerSession } from "next-auth";
import { notFound } from "next/navigation";

type Props = {
  params: {
    worldID: string;
    campaignID: string;
    entryID: string;
  };
};

const CampaignEntryPage = async ({ params }: Props) => {
  const campaignEntry = await getCampaignEntry(
    params.worldID,
    params.campaignID,
    params.entryID,
  );
  const session: Session | null = await getServerSession(authOptions);
  const email = session?.user?.email;
  const world: World | undefined = await getWorld(
    params.worldID,
    email as string,
  );
  const entries: Entry[] = await getCampaignEntries(
    params.worldID,
    params.campaignID,
  );

  if (!campaignEntry || !email || !world) {
    notFound();
  }
  const permissions = await getPermissions(
    email,
    params.worldID,
    params.campaignID,
  );

  return (
    <ClientEntryPage
      currentEntry={campaignEntry}
      world={world}
      entries={entries}
      permissions={permissions}
      session={session}
    />
  );
};

export default CampaignEntryPage;
