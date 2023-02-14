import ClientCampaignEntryPage from '@/components/campaign/entry/ClientCampaignEntryPage';
import ClientEntryPage from '@/components/entry/ClientEntryPage';
import {
  getCampaignEntries,
  getCampaignEntry,
  getCampaignPermissions,
  getWorld,
} from '@/lib/db';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Campaign, Entry, World } from '@/types';
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
  const { world }: { world: World | undefined } = await getWorld(
    params.worldID,
    session?.user?.email as string
  );
  const entries: Entry[] = await getCampaignEntries(
    params.worldID,
    params.campaignID
  );

  if (!campaignEntry || !session?.user?.email || !world) {
    notFound();
  }
  const permissions = await getCampaignPermissions(
    params.worldID,
    params.campaignID,
    session.user.email
  );

  return (
    <ClientEntryPage
      currentEntry={campaignEntry}
      world={world}
      entries={entries}
      permissions={permissions}
      session={session}
    />
  );
};

export default CampaignEntryPage;
