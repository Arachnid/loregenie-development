import admin from 'firebase-admin';
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Firestore,
} from 'firebase-admin/firestore';
import { World, Entry } from '@/types';

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

export async function getWorld(worldID: string): Promise<{
  world: World | undefined;
  entries: Entry[];
}> {
  const worldRef = await db
    .collection('worlds')
    .doc(worldID)
    .withConverter(new Converter<World>())
    .get();

  const world = worldRef.data();
  const entries = await getEntries(worldID);

  return {
    world,
    entries,
  };
}

export async function getEntries(worldID: string): Promise<Entry[]> {
  const entries = await db
    .collection('worlds')
    .doc(worldID)
    .collection('entries')
    .withConverter(new Converter<Entry>())
    .get();
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

export async function getPermissions(worldID: string, email: string) {
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
