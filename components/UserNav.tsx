import { Session } from 'next-auth';
import { getCampaigns } from '@/lib/db';
import CampaignsList from '@/components/CampaignsList';
import ClientUserNav from '@/components/ClientUserNav';
import { ExtendedCampaign, LocationMap } from '@/types';

interface Props {
  session: Session;
}

export default async function UserNav({ session }: Props) {
  const { campaigns, locations }: { campaigns: ExtendedCampaign[], locations: LocationMap } = await getCampaigns(
    session?.user?.email as string
  );
  return (
    <ClientUserNav>
      <CampaignsList campaigns={campaigns} locations={locations} />
    </ClientUserNav>
  );
}
