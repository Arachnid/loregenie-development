import { Converter, db } from '@/lib/db';
import { Campaign } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const {
    campaignData,
    campaignID,
    worldID,
    permissions,
  }: {
    campaignData: Campaign;
    campaignID: string;
    worldID: string;
    permissions: string[];
  } = JSON.parse(request.body);
  try {
    if (!permissions.includes('writer')) {
      console.log('user does not have permission for that action.');
      return;
    }
    await db
      .collection('worlds')
      .doc(worldID)
      .collection('campaigns')
      .doc(campaignID)
      .withConverter(new Converter<Campaign>())
      .update(campaignData);
  } catch (error) {
    console.log('error updating campaign to database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
