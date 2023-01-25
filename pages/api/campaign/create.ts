import { Converter, db } from '@/lib/db';
import { Campaign } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const {
    campaignData,
    worldID,
    permissions,
  }: { campaignData: Campaign; worldID: string; permissions: string[] } =
    JSON.parse(request.body);
  try {
    if (!permissions.includes('writer')) {
      console.log('user does not have permission for that action.');
      return;
    }
    const campaign = await db
      .collection('worlds')
      .doc(worldID)
      .collection('campaigns')
      .withConverter(new Converter<Campaign>())
      .add(campaignData);
    response.json(campaign.id);
  } catch (error) {
    console.log('error writing campaign to database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
}
