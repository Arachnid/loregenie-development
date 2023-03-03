import { Converter, db } from '@/lib/db';
import { CampaignDB, PermissionLevel } from '@/types';
import { contributorSanityCheck } from '@/utils/contributorSanityCheck';
import { hasPermission } from '@/utils/hasPermission';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const {
    campaignData,
    worldID,
  }: { campaignData: CampaignDB; worldID: string } = JSON.parse(request.body);

  try {
    if (
      !(await hasPermission(
        request,
        response,
        worldID,
        PermissionLevel.writer
      )) ||
      !contributorSanityCheck(
        request,
        response,
        campaignData,
        campaignData,
        worldID
      )
    ) {
      response.statusCode = 500;
      response.send({});
      return;
    }
    const campaign = await db
      .collection('worlds')
      .doc(worldID)
      .collection('campaigns')
      .withConverter(new Converter<CampaignDB>())
      .add(campaignData);
    response.json(campaign.id);
  } catch (error) {
    console.log('error writing campaign to database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
}
