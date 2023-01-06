import { getCampaign } from '@/lib/db';
import { notFound } from 'next/navigation';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Session, unstable_getServerSession } from 'next-auth';
import { Campaign } from '@/types';
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
  const session: Session | null = await unstable_getServerSession(authOptions);

  if (!campaign || !session?.user?.email) {
    notFound();
  }

  return (
    <>
      <ClientCampaignPage campaign={campaign} worldID={params.worldID} />
    </>
  );
}
