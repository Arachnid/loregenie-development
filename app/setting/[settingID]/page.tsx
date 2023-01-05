import { getSetting } from '@/lib/db';
import { notFound } from 'next/navigation';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Session, unstable_getServerSession } from 'next-auth';
import { Campaign, Location, NPC, Setting } from '@/types';
import ClientSettingPage from '@/components/setting/ClientSettingPage';
import CampaignList from '@/components/campaign/CampaignList';
import LocationList from '@/components/location/LocationList';
import NPCList from '@/components/npc/NPCList';

interface Props {
  params: {
    settingID: string;
  };
}

export default async function SettingPage({ params }: Props) {
  const {
    setting,
    campaigns,
    locations,
    npcs,
  }: {
    setting: Setting | undefined;
    campaigns: Campaign[];
    locations: Location[];
    npcs: NPC[];
  } = await getSetting(params.settingID);
  const session: Session | null = await unstable_getServerSession(authOptions);

  if (!setting || !session?.user?.email) {
    notFound();
  }

  return (
    <>
      <ClientSettingPage setting={setting} />
      <CampaignList campaigns={campaigns} settingID={setting.id as string} />
      <LocationList locations={locations} settingID={setting.id as string} />
      <NPCList npcs={npcs} settingID={setting.id as string} />
    </>
  );
}
