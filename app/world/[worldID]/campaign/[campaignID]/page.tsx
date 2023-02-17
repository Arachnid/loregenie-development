import {
  getCampaign,
  getCampaignPermissions,
  getContributors,
  getWorld,
} from '@/lib/db';
import { notFound } from 'next/navigation';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Session, getServerSession } from 'next-auth';
import { Campaign, World } from '@/types';
import ClientCampaignPage from '@/components/campaign/ClientCampaignPage';

interface Props {
  params: {
    worldID: string;
    campaignID: string;
  };
}

export default async function CampaignPage({ params }: Props) {
  const campaign: Campaign | undefined = await getCampaign(
    params.worldID,
    params.campaignID
  );
  const session: Session | null = await getServerSession(authOptions);

  const { world }: { world: World | undefined } = await getWorld(
    params.worldID,
    session?.user?.email as string
  );

  const contributors = await getContributors(params.worldID, params.campaignID);

  if (!campaign || !session?.user?.email || !world) {
    notFound();
  }
  const permissions = await getCampaignPermissions(
    params.worldID,
    params.campaignID,
    session.user.email
  );

  return (
    <ClientCampaignPage
      campaign={campaign}
      world={world}
      permissions={permissions}
      session={session}
      contributors={contributors}
    />
  );
}
