import ClientCampaignEntryPage from '@/components/campaign/entry/ClientCampaignEntryPage';
import { getCampaignEntry, getCampaignPermissions } from '@/lib/db';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Session, unstable_getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

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
    params.entryID
  );
  const session: Session | null = await unstable_getServerSession(authOptions);

  if (!campaignEntry || !session?.user?.email) {
    notFound();
  }
  const permissions = await getCampaignPermissions(
    params.worldID,
    params.campaignID,
    session.user.email
  );

  return (
    <ClientCampaignEntryPage
      campaignEntry={campaignEntry}
      worldID={params.worldID}
      campaignID={params.campaignID}
      permissions={permissions}
    />
  );
};

export default CampaignEntryPage;
