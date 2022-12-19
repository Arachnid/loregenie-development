import { ExecOptionsWithStringEncoding } from 'child_process';
import admin from 'firebase-admin';
import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot } from 'firebase-admin/firestore';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(process.env.GOOGLE_SERVICE_ACCOUNT as admin.ServiceAccount)
    });
  } catch (error) {
    console.log('Firebase admin initialization error', (error as Error).stack);
  }
}

export const db = admin.firestore();

class Converter<U> implements FirestoreDataConverter<U> {
    toFirestore(u: U): DocumentData {
        return u as DocumentData;
    }

    fromFirestore(snapshot: QueryDocumentSnapshot) {
        return Object.assign({id: snapshot.id}, snapshot.data()) as U;
    }
}

export interface Nav {
    key: string;
    children: Nav[];
}

export interface Campaign {
    readonly id: string;
    name: string;
    description: string;
    nav: Nav[];
    owner: string;
    readers: string[];
    writers: string[];
}

export interface Location {
    readonly id: string;
    campaign: string;
    name: string;
    description: string;
}

export async function getCampaigns(email: string) {
    const campaigns = await db.collection('campaigns')
        .where('readers', 'array-contains', email)
        .withConverter(new Converter<Campaign>())
        .get();
    let locationMap: {[key: string]: Location} = {};
    if(campaigns.docs.length > 0) {
        const locations = await db.collection('locations')
            .where('campaign', 'in', campaigns.docs.map((campaign) => campaign.id))
            .withConverter(new Converter<Location>())
            .get();
        locationMap = Object.fromEntries(locations.docs.map((location) => [location.id, location.data()]));
    }
    return {
        campaigns: campaigns.docs.map((campaign) => campaign.data()),
        locations: locationMap,
    };
}

export async function getCampaign(id: string) {
    const campaign = await db.collection('campaigns').doc(id).withConverter(new Converter<Campaign>()).get();
    return campaign.data();
}

export async function getLocation(id: string) {
    const location = await db.collection('locations').doc(id).withConverter(new Converter<Location>()).get();
    return location.data();
}