import { getWorld } from '@/lib/db';
import { notFound } from 'next/navigation';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Session, unstable_getServerSession } from 'next-auth';
import { Campaign, Location, Lore, NPC, World } from '@/types';
import ClientWorldPage from '@/components/world/ClientWorldPage';
import CampaignList from '@/components/campaign/CampaignList';
import LocationList from '@/components/location/LocationList';
import NPCList from '@/components/npc/NPCList';
import LoreList from '@/components/lore/LoreList';

interface Props {
  params: {
    worldID: string;
  };
}

export default async function WorldPage({ params }: Props) {
  const session: Session | null = await unstable_getServerSession(authOptions);
  const {
    world,
    campaigns,
    locations,
    npcs,
    loreEntries
  }: {
    world: World | undefined;
    campaigns: Campaign[];
    locations: Location[];
    npcs: NPC[];
    loreEntries: Lore[];
  } = await getWorld(params.worldID, session?.user?.email as string);

  if (!world || !session?.user?.email) {
    notFound();
  }

  return (
    <>
      <ClientWorldPage world={world} />
      <CampaignList campaigns={campaigns} worldID={world.id} />
      <LocationList locations={locations} worldID={world.id} />
      <NPCList npcs={npcs} worldID={world.id} />
      <LoreList loreEntries={loreEntries} worldID={world.id} />
    </>
  );
}
