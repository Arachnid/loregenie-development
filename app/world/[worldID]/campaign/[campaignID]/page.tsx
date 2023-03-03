import { getCampaign, getPermissions, getWorld } from '@/lib/db';
import { notFound } from 'next/navigation';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Session, getServerSession } from 'next-auth';
import { Campaign, World } from '@/types';
import ClientCampaignPage from '@/components/pages/ClientCampaignPage';

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
  const email = session?.user?.email;

  const world: World | undefined = await getWorld(
    params.worldID,
    email as string
  );

  if (!campaign || !email || !world) {
    notFound();
  }
  const permissions = await getPermissions(
    email,
    params.worldID,
    params.campaignID
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
