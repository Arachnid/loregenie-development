import { Session } from 'next-auth';
import { getCampaigns } from '../lib/db';
import CampaignsList from './CampaignsList';
import ClientUserNav from './ClientUserNav';

interface Props {
  session: Session;
}

export default async function UserNav({ session }: Props) {
  const { campaigns, locations } = await getCampaigns(
    session?.user?.email as string
  );
  return (
    <ClientUserNav>
      <CampaignsList campaigns={campaigns} locations={locations} />
    </ClientUserNav>
  );
}
