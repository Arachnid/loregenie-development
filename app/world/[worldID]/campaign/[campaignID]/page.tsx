import ClientCampaignPage from "@/components/pages/ClientCampaignPage";
import { getCampaign, getPermissions, getWorld } from "@/lib/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Campaign, World } from "@/types";
import { getServerSession, Session } from "next-auth";
import { notFound } from "next/navigation";

interface Props {
  params: {
    worldID: string;
    campaignID: string;
  };
}

export default async function CampaignPage({ params }: Props) {
  const campaign: Campaign | undefined = await getCampaign(
    params.worldID,
    params.campaignID,
  );
  const session: Session | null = await getServerSession(authOptions);
  const email = session?.user?.email;

  const world: World | undefined = await getWorld(
    params.worldID,
    email as string,
  );

  if (!campaign || !email || !world) {
    notFound();
  }
  const permissions = await getPermissions(
    email,
    params.worldID,
    params.campaignID,
  );

  return (
    <ClientCampaignPage
      campaign={campaign}
      world={world}
      permissions={permissions}
      session={session}
      contributors={campaign.contributors}
    />
  );
}
