import admin from 'firebase-admin';
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Firestore,
} from 'firebase-admin/firestore';
import { Storage } from 'firebase-admin/storage';
import {
  World,
  Entry,
  EntryHierarchy,
  Campaign,
  User,
  WorldDB,
  CampaignDB,
} from '@/types';
import { createEntryHierarchy } from '@/utils/createEntryHierarchy';

if (!admin.apps.length) {
  try {
    if (process.env.GOOGLE_SERVICE_ACCOUNT) {
      admin.initializeApp({
        credential: admin.credential.cert(
          process.env.GOOGLE_SERVICE_ACCOUNT as admin.ServiceAccount
        ),
        storageBucket: process.env.GOOGLE_STORAGE_BUCKET,
      });
    } else {
      admin.initializeApp();
    }
  } catch (error) {
    console.log('Firebase admin initialization error', (error as Error).stack);
  }
}

export const storage: Storage = admin.storage();
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
  const worldsDB = await db
    .collection('worlds')
    .where('readers', 'array-contains', email)
    .withConverter(new Converter<WorldDB>())
    .get();

  const worlds = await Promise.all(
    worldsDB.docs.map(async (world): Promise<World> => {
      const worldData = world.data();
      const contributors = await getContributors(world.id);
      const entries = await getEntries(
        world.id,
        worldData.public,
        worldData.readers.includes(email)
      );
      const campaigns = await getCampaigns(world.id, email);

      return {
        ...worldData,
        contributors,
        entries,
        campaigns,
      };
    })
  );

  return worlds;
}

export async function getWorld(
  worldID: string,
  email: string
): Promise<World | undefined> {
  const worldDB = (
    await db
      .collection('worlds')
      .doc(worldID)
      .withConverter(new Converter<WorldDB>())
      .get()
  ).data();

  const world = async (): Promise<World | undefined> => {
    if (!worldDB) {
      return undefined;
    }

    if (worldDB.readers.includes(email) || worldDB.public) {
      const entries = await getEntries(
        worldDB.id,
        worldDB.public,
        worldDB.readers.includes(email)
      );
      const campaigns = await getCampaigns(worldDB.id, email);
      const contributors = await getContributors(worldDB.id);
      return {
        ...worldDB,
        entries,
        campaigns,
        contributors,
      };
    }
    return undefined;
  };
  return await world();
}

export async function getCampaigns(
  worldID: string,
  email: string
): Promise<Campaign[]> {
  const campaignsDB = await db
    .collection('worlds')
    .doc(worldID)
    .collection('campaigns')
    .where('readers', 'array-contains', email)
    .withConverter(new Converter<CampaignDB>())
    .get();

  const campaignsWithEntries = await Promise.all(
    campaignsDB.docs.map(async (campaign): Promise<Campaign | undefined> => {
      const campaignData = campaign.data();

      const contributors = await getContributors(worldID, campaignData.id);
      const campaignEntries = await getCampaignEntries(
        worldID,
        campaignData.id
      );

      if (!campaignData.readers.includes(email) && !campaignData.public) {
        return undefined;
      }
      if (!campaignData.readers.includes(email) && campaignData.public) {
        const entryHierarchy: EntryHierarchy[] =
          createEntryHierarchy(campaignEntries);

        const publicEntryIDs: string[] = [];

        const recursiveEntryHierarchy = (
          entriesHierarchy: EntryHierarchy[]
        ) => {
          entriesHierarchy.map((entry: EntryHierarchy) => {
            if (entry.public) {
              if (entry.children) {
                publicEntryIDs.push(entry.id);
                return recursiveEntryHierarchy(entry.children);
              }
              publicEntryIDs.push(entry.id);
            }
          });
        };

        recursiveEntryHierarchy(entryHierarchy);

        return {
          ...campaignData,
          entries: campaignEntries.filter((entry) =>
            publicEntryIDs.includes(entry.id)
          ),
          contributors,
        };
      }
      return {
        ...campaignData,
        entries: campaignEntries,
        contributors,
      };
    })
  );

  return campaignsWithEntries as Campaign[];
}

export async function getCampaign(
  worldID: string,
  campaignID: string
): Promise<Campaign | undefined> {
  const campaignDB = (
    await db
      .collection('worlds')
      .doc(worldID)
      .collection('campaigns')
      .doc(campaignID)
      .withConverter(new Converter<CampaignDB>())
      .get()
  ).data();

  const campaign = async (): Promise<Campaign | undefined> => {
    if (campaignDB) {
      const entries = await getCampaignEntries(worldID, campaignDB.id);
      const contributors = await getContributors(worldID, campaignDB.id);
      return {
        ...campaignDB,
        entries,
        contributors,
      };
    }
    return undefined;
  };

  return await campaign();
}

export async function getCampaignEntries(
  worldID: string,
  campaignID: string
): Promise<Entry[]> {
  const campaignEntries = await db
    .collection('worlds')
    .doc(worldID)
    .collection('campaigns')
    .doc(campaignID)
    .collection('entries')
    .withConverter(new Converter<Entry>())
    .get();
  return campaignEntries.docs.map((campaignEntry) => campaignEntry.data());
}

export async function getCampaignEntry(
  worldID: string,
  campaignID: string,
  entryID: string
): Promise<Entry | undefined> {
  const campaignEntry = await db
    .collection('worlds')
    .doc(worldID)
    .collection('campaigns')
    .doc(campaignID)
    .collection('entries')
    .doc(entryID)
    .withConverter(new Converter<Entry>())
    .get();
  return campaignEntry.data();
}

export async function getEntries(
  worldID: string,
  isPublicWorld: boolean,
  isReader: boolean
): Promise<Entry[]> {
  const entries = await db
    .collection('worlds')
    .doc(worldID)
    .collection('entries')
    .withConverter(new Converter<Entry>())
    .get();

  if (isPublicWorld && !isReader) {
    const entryHierarchy: EntryHierarchy[] = createEntryHierarchy(
      entries.docs.map((entry) => entry.data())
    );
    const publicEntryIDs: string[] = [];
    const recursiveEntryHierarchy = (entriesHierarchy: EntryHierarchy[]) => {
      entriesHierarchy.map((entry: EntryHierarchy) => {
        if (entry.public) {
          if (entry.children) {
            publicEntryIDs.push(entry.id);
            return recursiveEntryHierarchy(entry.children);
          }
          publicEntryIDs.push(entry.id);
        }
      });
    };
    recursiveEntryHierarchy(entryHierarchy);

    return entries.docs
      .filter((entry) => publicEntryIDs.includes(entry.data().id))
      .map((entry) => entry.data());
  }
  return entries.docs.map((entry) => entry.data());
}

export async function getEntry(worldID: string, entryID: string) {
  const entry = await db
    .collection('worlds')
    .doc(worldID)
    .collection('entries')
    .doc(entryID)
    .withConverter(new Converter<Entry>())
    .get();
  return entry.data();
}

export async function getPermissions(
  worldID: string,
  email: string
): Promise<string[]> {
  const world = await db
    .collection('worlds')
    .doc(worldID)
    .withConverter(new Converter<World>())
    .get();

  if (world.data()?.admins.includes(email)) {
    return ['admin', 'writer', 'reader'];
  } else if (world.data()?.writers.includes(email)) {
    return ['writer', 'reader'];
  } else if (world.data()?.readers.includes(email)) {
    return ['reader'];
  } else {
    return [];
  }
}

export async function getCampaignPermissions(
  worldID: string,
  campaignID: string,
  email: string
): Promise<string[]> {
  const world = await db
    .collection('worlds')
    .doc(worldID)
    .withConverter(new Converter<World>())
    .get();
  const campaign = await db
    .collection('worlds')
    .doc(worldID)
    .collection('campaigns')
    .doc(campaignID)
    .withConverter(new Converter<Campaign>())
    .get();

  if (world.data()?.readers.includes(email)) {
    if (campaign.data()?.admins.includes(email)) {
      return ['admin', 'writer', 'reader'];
    } else if (campaign.data()?.writers.includes(email)) {
      return ['writer', 'reader'];
    } else if (campaign.data()?.readers.includes(email)) {
      return ['reader'];
    } else {
      return [];
    }
  } else {
    return [];
  }
}

export async function getContributors(
  worldID: string,
  campaignID?: string
): Promise<User[]> {
  let docRef: admin.firestore.DocumentReference<World | Campaign> = db
    .collection('worlds')
    .doc(worldID)
    .withConverter(new Converter<World>());

  if (campaignID) {
    docRef = docRef
      .collection('campaigns')
      .doc(campaignID)
      .withConverter(new Converter<Campaign>());
  }
  const readerEmails = (await docRef.get()).data()?.readers;
  const contributors = await db
    .collection('users')
    .where('email', 'in', readerEmails)
    .withConverter(new Converter<User>())
    .get();
  return contributors.docs.map((contributor) => contributor.data());
}
