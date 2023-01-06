import admin from 'firebase-admin';
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Firestore,
} from 'firebase-admin/firestore';
import {
  Campaign,
  PlotPoints,
  Location,
  NPC,
  World,
  JournalEntry,
  Lore,
} from '@/types';

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

export async function getWorlds(email: string) {
  const worlds = await db
    .collection('worlds')
    .where('readers', 'array-contains', email)
    .withConverter(new Converter<World>())
    .get();
  return worlds.docs.map((world) => getWorld(world.id, email));
}

export async function getWorld(
  worldID: string,
  email: string
): Promise<{
  world: World | undefined;
  campaigns: Campaign[];
  locations: Location[];
  npcs: NPC[];
  loreEntries: Lore[];
}> {
  const worldRef = await db
    .collection('worlds')
    .doc(worldID)
    .withConverter(new Converter<World>())
    .get();

  const world = worldRef.data();
  const campaigns = await getCampaigns(worldID, email);
  const locations = await getLocations(worldID);
  const npcs = await getNPCs(worldID);
  const loreEntries = await getLoreEntries(worldID);

  return {
    world,
    campaigns,
    locations,
    npcs,
    loreEntries,
  };
}

export async function getCampaigns(
  worldID: string,
  email: string
): Promise<Campaign[]> {
  const campaigns = await db
    .collection('worlds')
    .doc(worldID)
    .collection('campaigns')
    .where('readers', 'array-contains', email)
    .withConverter(new Converter<Campaign>())
    .get();
  return campaigns.docs.map((campaign) => campaign.data());
}

export async function getCampaign(
  worldID: string,
  campaignID: string
): Promise<{
  campaign: Campaign | undefined;
  journalEntries: JournalEntry[];
}> {
  const campaignRef = await db
    .collection('worlds')
    .doc(worldID)
    .withConverter(new Converter<World>())
    .collection('campaigns')
    .doc(campaignID)
    .withConverter(new Converter<Campaign>())
    .get();

  const campaign = campaignRef.data();
  const journalEntries = await getJournalEntries(worldID, campaignID);

  return {
    campaign,
    journalEntries,
  };
}

export async function getJournalEntries(
  worldID: string,
  campaignID: string
): Promise<JournalEntry[]> {
  const journalEntries = await db
    .collection('worlds')
    .doc(worldID)
    .collection('campaigns')
    .doc(campaignID)
    .collection('journalEntries')
    .withConverter(new Converter<JournalEntry>())
    .get();

  return journalEntries.docs.map((journalEntry) => journalEntry.data());
}

export async function getJournalEntry(
  worldID: string,
  campaignID: string,
  journalEntryID: string
): Promise<JournalEntry | undefined> {
  const journalEntry = await db
    .collection('worlds')
    .doc(worldID)
    .collection('campaigns')
    .doc(campaignID)
    .collection('journalEntries')
    .doc(journalEntryID)
    .withConverter(new Converter<JournalEntry>())
    .get();
  return journalEntry.data();
}

export async function getLocations(worldID: string): Promise<Location[]> {
  const plotPoints = await db
    .collection('worlds')
    .doc(worldID)
    .collection('plotPoints')
    .withConverter(new Converter<PlotPoints>())
    .get();

  const isLocation = (location: Location | undefined): location is Location => {
    return location !== undefined;
  };

  const assertedLocations: Location[] = [];

  plotPoints.docs.map((plotPoint) => {
    const data = plotPoint.data();
    if (data.plotPoint === 'Location') {
      if (isLocation(data)) {
        assertedLocations.push(data);
      }
    }
  });

  return assertedLocations;
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
  const plotPoints = await db
    .collection('worlds')
    .doc(worldID)
    .collection('plotPoints')
    .withConverter(new Converter<PlotPoints>())
    .get();

  const isNPC = (npc: NPC | undefined): npc is NPC => {
    return npc !== undefined;
  };

  const assertedNPCs: NPC[] = [];

  plotPoints.docs.map((plotPoint) => {
    const data = plotPoint.data();
    if (data.plotPoint === 'NPC') {
      if (isNPC(data)) {
        assertedNPCs.push(data);
      }
    }
  });

  return assertedNPCs;
}

export async function getLoreEntries(worldID: string): Promise<Lore[]> {
  const plotPoints = await db
    .collection('worlds')
    .doc(worldID)
    .collection('plotPoints')
    .withConverter(new Converter<PlotPoints>())
    .get();

  const isLore = (lore: Lore | undefined): lore is Lore => {
    return lore !== undefined;
  };

  const assertedLoreEntries: Lore[] = [];

  plotPoints.docs.map((plotPoint) => {
    const data = plotPoint.data();
    if (data.plotPoint === 'Lore') {
      if (isLore(data)) {
        assertedLoreEntries.push(data);
      }
    }
  });

  return assertedLoreEntries;
}

export async function getLore(
  worldID: string,
  loreID: string
): Promise<Lore | undefined> {
  const lore = await db
    .collection('worlds')
    .doc(worldID)
    .collection('plotPoints')
    .doc(loreID)
    .withConverter(new Converter<Lore>())
    .get();

  return lore.data();
}
