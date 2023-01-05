import admin from 'firebase-admin';
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Firestore,
} from 'firebase-admin/firestore';
import {
  Campaign,
  Item,
  Location,
  LocationMap,
  NPC,
  NPCMap,
  Setting,
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

export async function getSettings(email: string): Promise<Setting[]> {
  const settings = await db
    .collection('settings')
    .where('readers', 'array-contains', email)
    .withConverter(new Converter<Setting>())
    .get();
  return settings.docs.map((setting) => setting.data());
}

export async function getSetting(
  id: string
): Promise<{
  setting: Setting | undefined;
  campaigns: Campaign[];
  items: Item[];
}> {
  const setting = db
    .collection('settings')
    .doc(id)
    .withConverter(new Converter<Setting>());

  const campaigns = setting
    .collection('campaigns')
    .withConverter(new Converter<Campaign>());

  const items = setting.collection('items').withConverter(new Converter<Item>())

  return {
    setting: (await setting.get()).data(),
    campaigns: (await campaigns.get()).docs.map((campaign) => campaign.data()),
    items: (await items.get()).docs.map((item) => item.data())
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

export async function getCampaign(id: string): Promise<Campaign | undefined> {
  const campaign = db
    .collection('campaigns')
    .doc(id)
    .withConverter(new Converter<Campaign>());

  //wip
  let response: admin.firestore.DocumentData[] = [];
  const recursiveCollections = async (
    collection: admin.firestore.CollectionReference<admin.firestore.DocumentData>,
    docID: string
  ) => {
    const subCollections = await collection.doc(docID).listCollections();
    if (subCollections.length > 0) {
      subCollections.forEach(async (subCollection) => {
        let id = '';
        await subCollection.get().then((docs) =>
          docs.forEach((doc) => {
            id = doc.id;
            response.push(doc.data());
          })
        );
        recursiveCollections(subCollection, id);
      });
    }
  };
  recursiveCollections(db.collection('campaigns'), id);

  return (await campaign.get()).data();
}

export async function getLocations(
  id: string
): Promise<LocationMap | undefined> {
  let locationMap: LocationMap = {};
  const locations = await db
    .collection('locations')
    .where('campaign', '==', id)
    .withConverter(new Converter<Location>())
    .get();
  locationMap = Object.fromEntries<Location>(
    locations.docs.map((location: QueryDocumentSnapshot<Location>) => [
      location.id,
      location.data(),
    ])
  ) as unknown as LocationMap;
  return locationMap;
}

export async function getLocation(id: string): Promise<Location | undefined> {
  const location = await db
    .collection('locations')
    .doc(id)
    .withConverter(new Converter<Location>())
    .get();
  return location.data();
}

export async function getNPC(id: string): Promise<NPC | undefined> {
  const npc = await db
    .collection('npcs')
    .doc(id)
    .withConverter(new Converter<NPC>())
    .get();
  return npc.data();
}

export async function getNPCs(): Promise<NPCMap | undefined> {
  let npcMap: NPCMap = {};
  const npcs = await db
    .collection('npcs')
    .withConverter(new Converter<NPC>())
    .get();
  npcMap = Object.fromEntries<NPC>(
    npcs.docs.map((npc: QueryDocumentSnapshot<NPC>) => [npc.id, npc.data()])
  ) as unknown as NPCMap;
  return npcMap;
}
