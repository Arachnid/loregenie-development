import admin from 'firebase-admin';
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Firestore,
} from 'firebase-admin/firestore';
import { ExtendedCampaign, Location, LocationMap, NPC, NPCMap } from '@/types';

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

export async function getCampaigns(
  email: string
): Promise<{ campaigns: ExtendedCampaign[]; locations: LocationMap }> {
  const campaigns = await db
    .collection('campaigns')
    .where('readers', 'array-contains', email)
    .withConverter(new Converter<ExtendedCampaign>())
    .get();
  let locationMap: LocationMap = {};
  if (campaigns.docs.length > 0) {
    const locations = await db
      .collection('locations')
      .where(
        'campaign',
        'in',
        campaigns.docs.map((campaign) => campaign.id)
      )
      .withConverter(new Converter<Location>())
      .get();
    locationMap = Object.fromEntries<Location>(
      locations.docs.map((location: QueryDocumentSnapshot<Location>) => [
        location.id,
        location.data(),
      ])
    ) as unknown as LocationMap;
  }
  return {
    campaigns: campaigns.docs.map((campaign) => campaign.data()),
    locations: locationMap,
  };
}

export async function getCampaign(
  id: string
): Promise<ExtendedCampaign | undefined> {
  const campaign = db
    .collection('campaigns')
    .doc(id)
    .withConverter(new Converter<ExtendedCampaign>());

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
    npcs.docs.map((npc: QueryDocumentSnapshot<NPC>) => [
      npc.id,
      npc.data(),
    ])
  ) as unknown as NPCMap;
  return npcMap;
}
