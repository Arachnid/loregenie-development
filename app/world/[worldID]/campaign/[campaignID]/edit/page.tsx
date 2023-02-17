import CampaignForm from '@/components/campaign/CampaignForm';
import { getCampaign, getCampaignPermissions } from '@/lib/db';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Campaign } from '@/types';
import { Session, getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import React from 'react';

interface Props {
  params: {
    campaignID: string;
    worldID: string;
  };
}

const EditCampaignPage = async ({ params }: Props) => {
  const campaign: Campaign | undefined = await getCampaign(
    params.worldID,
    params.campaignID
  );
  const session: Session | null = await getServerSession(authOptions);

  if (!campaign || !session?.user?.email) {
    notFound();
  }
  const permissions = await getCampaignPermissions(
    params.worldID,
    params.campaignID,
    session.user.email
  );

  return (
    <CampaignForm
      sessionEmail={session.user.email}
      campaign={campaign}
      worldID={params.worldID}
      permissions={permissions}
    />
  );
};

export default EditCampaignPage;
