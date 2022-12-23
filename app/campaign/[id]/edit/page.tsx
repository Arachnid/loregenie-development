import ViewEditCampaignPage from '@/components/ViewEditCampaignPage';
import { getCampaign } from '@/lib/db';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { ExtendedCampaign } from '@/types';
import { Session, unstable_getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import React from 'react'

interface Props {
  params: {
    id: string;
  };
}

const editCampaignPage = async ({ params }: Props) => {
  const campaign: ExtendedCampaign | undefined = await getCampaign(params.id);
  const session: Session | null = await unstable_getServerSession(authOptions);

  if (!campaign || !session?.user?.email) {
    notFound();
  }

  return <ViewEditCampaignPage sessionEmail={session.user.email} campaign={campaign} />
}

export default editCampaignPage;