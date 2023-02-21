import { Converter, db } from '@/lib/db';
import { Campaign, PermissionLevel } from '@/types';
import { hasPermission } from '@/utils/hasPermission';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const {
    campaignData,
    campaignID,
    worldID,
  }: {
    campaignData: Campaign;
    campaignID: string;
    worldID: string;
  } = JSON.parse(request.body);
  try {
    if (
      !(await hasPermission(request, response, worldID, PermissionLevel.writer))
    ) {
      response.statusCode = 500;
      response.send({});
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
