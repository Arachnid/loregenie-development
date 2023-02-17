import CampaignEntryForm from '@/components/campaign/entry/CampaignEntryForm';
import { getCampaignEntries, getCampaignPermissions } from '@/lib/db';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Entry } from '@/types';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

type Props = {
  params: {
    worldID: string;
    campaignID: string;
  };
};

export default async function NewCampaignEntryPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  const campaignEntries: Entry[] = await getCampaignEntries(
    params.worldID,
    params.campaignID
  );
  if (!session?.user?.email) {
    notFound();
  }
  const permissions = await getCampaignPermissions(
    params.worldID,
    params.campaignID,
    session.user.email
  );
  return (
    <>
      <h1>Create New Campaign Entry</h1>
      <CampaignEntryForm
        worldID={params.worldID}
        campaignID={params.campaignID}
        campaignEntries={campaignEntries}
        permissions={permissions}
      />
    </>
  );
}
