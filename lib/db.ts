import admin from 'firebase-admin';
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Firestore,
} from 'firebase-admin/firestore';
import { Campaign, PlotPoints, Location, NPC, Setting } from '@/types';

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

export async function getSettings(email: string): Promise<Setting[]> {
  const settings = await db
    .collection('settings')
    .where('readers', 'array-contains', email)
    .withConverter(new Converter<Setting>())
    .get();
  return settings.docs.map((setting) => setting.data());
}

export async function getSetting(id: string): Promise<{
  setting: Setting | undefined;
  campaigns: Campaign[];
  locations: Location[];
  npcs: NPC[];
}> {
  const settingRef = db
    .collection('settings')
    .doc(id)
    .withConverter(new Converter<Setting>());

  const setting = (await settingRef.get()).data();

  const campaigns = (
    await settingRef
      .collection('campaigns')
      .withConverter(new Converter<Campaign>())
      .get()
  ).docs.map((campaign) => campaign.data());

  const plotPoints = await settingRef
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
    setting,
    campaigns,
    locations: assertedLocations,
    npcs: assertedNPCs,
  };
}

export async function getCampaigns(id: string): Promise<Campaign[]> {
  const campaigns = await db
    .collection('settings')
    .doc(id)
    .collection('campaigns')
    .withConverter(new Converter<Campaign>())
    .get();
  return campaigns.docs.map((campaign) => campaign.data());
}

export async function getCampaign(
  settingID: string,
  campaignID: string
): Promise<Campaign | undefined> {
  const campaign = await db
    .collection('settings')
    .doc(settingID)
    .withConverter(new Converter<Setting>())
    .collection('campaigns')
    .doc(campaignID)
    .withConverter(new Converter<Campaign>())
    .get();

  return campaign.data();
}

export async function getLocations(settingID: string): Promise<Location[]> {
  const locations = await db
    .collection('settings')
    .doc(settingID)
    .collection('locations')
    .withConverter(new Converter<Location>())
    .get();
  return locations.docs.map((location) => location.data());
}

export async function getLocation(
  settingID: string,
  locationID: string
): Promise<Location | undefined> {
  const location = await db
    .collection('settings')
    .doc(settingID)
    .collection('plotPoints')
    .doc(locationID)
    .withConverter(new Converter<Location>())
    .get();
  return location.data();
}

export async function getNPC(
  settingID: string,
  npcID: string
): Promise<NPC | undefined> {
  const npc = await db
    .collection('settings')
    .doc(settingID)
    .collection('plotPoints')
    .doc(npcID)
    .withConverter(new Converter<NPC>())
    .get();
  return npc.data();
}

export async function getNPCs(settingID: string): Promise<NPC[]> {
  const npcs = await db
    .collection('settings')
    .doc(settingID)
    .collection('plotPoints')
    .withConverter(new Converter<NPC>())
    .get();
  return npcs.docs.map((npc) => npc.data());
}
