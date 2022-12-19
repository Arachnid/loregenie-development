import db from './db';

export async function getCampaignHierarchy(email: string) {
    const campaigns = await db.collection('campaign')
        .where('readers', 'array-contains', session?.user?.email)
        .get();
    const locations = await db.collectionGroup('location')
        .where('campaign', 'in', campaigns.docs.map((doc) => doc.id))
        .get();
}