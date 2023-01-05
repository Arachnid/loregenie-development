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
    settingID,
  }: { campaignData: Campaign; campaignID: string; settingID: string } =
    JSON.parse(request.body);
  try {
    await db
      .collection('settings')
      .doc(settingID)
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
