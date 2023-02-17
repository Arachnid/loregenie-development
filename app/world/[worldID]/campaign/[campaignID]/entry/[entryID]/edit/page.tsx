import {
  getCampaignEntries,
  getCampaignEntry,
  getCampaignPermissions,
} from '@/lib/db';
import { notFound } from 'next/navigation';
import { Entry } from '@/types';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import CampaignEntryForm from '@/components/campaign/entry/CampaignEntryForm';

interface Props {
  params: {
    worldID: string;
    campaignID: string;
    entryID: string;
  };
}

export default async function EditCampaignPage({ params }: Props) {
  const currentEntry: Entry | undefined = await getCampaignEntry(
    params.worldID,
    params.campaignID,
    params.entryID
  );
  const session: Session | null = await getServerSession(authOptions);
  const campaignEntries: Entry[] = await getCampaignEntries(
    params.worldID,
    session?.user?.email as string
  );
  if (!currentEntry || !session?.user?.email) {
    notFound();
  }
  const permissions = await getCampaignPermissions(
    params.worldID,
    params.campaignID,
    session.user.email
  );
  return (
    <>
      <h1>Edit Campaign Entry</h1>
      <CampaignEntryForm
        currentEntry={currentEntry}
        worldID={params.worldID}
        campaignID={params.campaignID}
        campaignEntries={campaignEntries}
        permissions={permissions}
      />
    </>
  );
}
