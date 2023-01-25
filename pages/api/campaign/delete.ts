import { db } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const {
    campaignID,
    worldID,
    permissions,
  }: { campaignID: string; worldID: string; permissions: string[] } =
    JSON.parse(request.body);

  try {
    if (!permissions.includes('admin')) {
      console.log('user does not have permission for that action.');
      return;
    }
    await db.recursiveDelete(
      db
        .collection('worlds')
        .doc(worldID)
        .collection('campaigns')
        .doc(campaignID)
    );
  } catch (error) {
    console.log('error deleting campaign from database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
