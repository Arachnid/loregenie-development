import admin from 'firebase-admin';
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Firestore,
} from 'firebase-admin/firestore';
import { Campaign, PlotPoints, Location, NPC, World } from '@/types';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(
        process.env.GOOGLE_SERVICE_ACCOUNT as admin.ServiceAccount
      ),
    });
  } catch (error) {
    console.log('Firebase admin initialization error', (error as Error).stack);
  }
}

export const db: Firestore = admin.firestore();

export class Converter<U> implements FirestoreDataConverter<U> {
  toFirestore(u: U): DocumentData {
    return u as DocumentData;
  }

  fromFirestore(snapshot: QueryDocumentSnapshot) {
    return Object.assign({ id: snapshot.id }, snapshot.data()) as U;
  }
}

export async function getWorlds(email: string): Promise<World[]> {
  const worlds = await db
    .collection('worlds')
    .where('readers', 'array-contains', email)
    .withConverter(new Converter<World>())
    .get();
  return worlds.docs.map((world) => world.data());
}

export async function getWorld(id: string): Promise<{
  world: World | undefined;
  campaigns: Campaign[];
  locations: Location[];
  npcs: NPC[];
}> {
  const worldRef = db
    .collection('worlds')
    .doc(id)
    .withConverter(new Converter<World>());

  const world = (await worldRef.get()).data();

  const campaigns = (
    await worldRef
      .collection('campaigns')
      .withConverter(new Converter<Campaign>())
      .get()
  ).docs.map((campaign) => campaign.data());

  const plotPoints = await worldRef
    .collection('plotPoints')
    .withConverter(new Converter<PlotPoints>())
    .get();

  const isLocation = (location: Location | undefined): location is Location => {
    return location !== undefined;
  };
  const isNPC = (npc: NPC | undefined): npc is NPC => {
    return npc !== undefined;
  };

  const assertedLocations: Location[] = [];
  const assertedNPCs: NPC[] = [];

  plotPoints.docs.map((plotPoint) => {
    const data = plotPoint.data();
    if (data.plotPoint === 'Location') {
      if (isLocation(data)) {
        assertedLocations.push(data);
      }
    } else if (data.plotPoint === 'NPC') {
      if (isNPC(data)) {
        assertedNPCs.push(data);
      }
    }
  });

  return {
    world,
    campaigns,
    locations: assertedLocations,
    npcs: assertedNPCs,
  };
}

export async function getCampaigns(id: string): Promise<Campaign[]> {
  const campaigns = await db
    .collection('worlds')
    .doc(id)
    .collection('campaigns')
    .withConverter(new Converter<Campaign>())
    .get();
  return campaigns.docs.map((campaign) => campaign.data());
}

export async function getCampaign(
  worldID: string,
  campaignID: string
): Promise<Campaign | undefined> {
  const campaign = await db
    .collection('worlds')
    .doc(worldID)
    .withConverter(new Converter<World>())
    .collection('campaigns')
    .doc(campaignID)
    .withConverter(new Converter<Campaign>())
    .get();

  return campaign.data();
}

export async function getLocations(worldID: string): Promise<Location[]> {
  const locations = await db
    .collection('worlds')
    .doc(worldID)
    .collection('locations')
    .withConverter(new Converter<Location>())
    .get();
  return locations.docs.map((location) => location.data());
}

export async function getLocation(
  worldID: string,
  locationID: string
): Promise<Location | undefined> {
  const location = await db
    .collection('worlds')
    .doc(worldID)
    .collection('plotPoints')
    .doc(locationID)
    .withConverter(new Converter<Location>())
    .get();
  return location.data();
}

export async function getNPC(
  worldID: string,
  npcID: string
): Promise<NPC | undefined> {
  const npc = await db
    .collection('worlds')
    .doc(worldID)
    .collection('plotPoints')
    .doc(npcID)
    .withConverter(new Converter<NPC>())
    .get();
  return npc.data();
}

export async function getNPCs(worldID: string): Promise<NPC[]> {
  const npcs = await db
    .collection('worlds')
    .doc(worldID)
    .collection('plotPoints')
    .withConverter(new Converter<NPC>())
    .get();
  return npcs.docs.map((npc) => npc.data());
}
