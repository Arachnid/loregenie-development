import { Converter, db } from '@/lib/db';
import { Campaign, PermissionLevel } from '@/types';
import { hasPermission } from '@/utils/hasPermission';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { campaignData, worldID }: { campaignData: Campaign; worldID: string } =
    JSON.parse(request.body);
    
  try {
    if (
      !(await hasPermission(request, response, worldID, PermissionLevel.writer))
    ) {
      response.statusCode = 500;
      response.send({});
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
