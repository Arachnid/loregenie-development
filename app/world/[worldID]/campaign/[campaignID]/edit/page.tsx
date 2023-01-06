import CampaignForm from '@/components/campaign/CampaignForm';
import { getCampaign } from '@/lib/db';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Campaign } from '@/types';
import { Session, unstable_getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import React from 'react';

interface Props {
  params: {
    campaignID: string;
    worldID: string;
  };
}

const EditCampaignPage = async ({ params }: Props) => {
  const { campaign }: { campaign: Campaign | undefined } = await getCampaign(
    params.worldID,
    params.campaignID
  );
  const session: Session | null = await unstable_getServerSession(authOptions);

  if (!campaign || !session?.user?.email) {
    notFound();
  }

  return (
    <CampaignForm
      sessionEmail={session.user.email}
      campaign={campaign}
      worldID={params.worldID}
    />
  );
};

export default EditCampaignPage;
