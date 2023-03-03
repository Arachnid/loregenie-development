import { Converter, db } from '@/lib/db';
import { CampaignDB } from '@/types';
import { updateValidation } from '@/utils/validation/updateValidation';
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
    if (!(await updateValidation(request, response, campaignData, docData))) {
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
