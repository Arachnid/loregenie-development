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
    settingID: string;
  };
}

const editCampaignPage = async ({ params }: Props) => {
  const campaign: Campaign | undefined = await getCampaign(
    params.settingID,
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
      settingID={params.settingID}
    />
  );
};

export default editCampaignPage;
