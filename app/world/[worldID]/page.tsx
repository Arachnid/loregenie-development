import { getWorld } from '@/lib/db';
import { notFound } from 'next/navigation';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Session, unstable_getServerSession } from 'next-auth';
import { Campaign, Location, NPC, World } from '@/types';
import ClientWorldPage from '@/components/world/ClientWorldPage';
import CampaignList from '@/components/campaign/CampaignList';
import LocationList from '@/components/location/LocationList';
import NPCList from '@/components/npc/NPCList';

interface Props {
  params: {
    worldID: string;
  };
}

export default async function WorldPage({ params }: Props) {
  const {
    world,
    campaigns,
    locations,
    npcs,
  }: {
    world: World | undefined;
    campaigns: Campaign[];
    locations: Location[];
    npcs: NPC[];
  } = await getWorld(params.worldID);
  const session: Session | null = await unstable_getServerSession(authOptions);

  if (!world || !session?.user?.email) {
    notFound();
  }

  return (
    <>
      <ClientWorldPage world={world} />
      <CampaignList campaigns={campaigns} worldID={world.id as string} />
      <LocationList locations={locations} worldID={world.id as string} />
      <NPCList npcs={npcs} worldID={world.id as string} />
    </>
  );
}
