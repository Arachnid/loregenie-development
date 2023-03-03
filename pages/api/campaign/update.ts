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
  }: {
    campaignData: CampaignDB;
    campaignID: string;
    worldID: string;
  } = JSON.parse(request.body);

  const docRef = db
    .collection('worlds')
    .doc(worldID)
    .collection('campaigns')
    .doc(campaignData.id)
    .withConverter(new Converter<CampaignDB>());

  const docData = (await docRef.get()).data();

  try {
    if (
      !(await hasPermission(
        request,
        response,
        worldID,
        PermissionLevel.writer
      )) ||
      !(await contributorSanityCheck(
        request,
        response,
        campaignData,
        docData,
        worldID
      ))
    ) {
      response.statusCode = 500;
      response.send({});
      return;
    }
    await docRef.update(campaignData);
  } catch (error) {
    console.log('error updating campaign to database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
