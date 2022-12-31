import { Session } from 'next-auth';
import { getCampaigns, getNPCs } from '@/lib/db';
import CampaignsList2 from '@/components/CampaignsList2';
import ClientUserNav from '@/components/ClientUserNav';
import { ExtendedCampaign, LocationMap, NPCMap } from '@/types';
import NPCList from './NPCList';

interface Props {
  session: Session;
}

export default async function UserNav({ session }: Props) {
  const {
    campaigns,
    locations,
  }: { campaigns: ExtendedCampaign[]; locations: LocationMap } =
    await getCampaigns(session?.user?.email as string);

  const npcs: NPCMap | undefined = await getNPCs();
  return (
    <ClientUserNav>
      <>
        <CampaignsList2 campaigns={campaigns} locations={locations} />
        {npcs && <NPCList npcs={npcs} />}
      </>
    </ClientUserNav>
  );
}
