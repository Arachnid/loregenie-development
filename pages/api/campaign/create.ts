import { Converter, db } from '@/lib/db';
import { Campaign } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const {
    campaignData,
    settingID,
  }: { campaignData: Campaign; settingID: string } = JSON.parse(request.body);
  try {
    await db
      .collection('settings')
      .doc(settingID)
      .collection('campaigns')
      .withConverter(new Converter<Campaign>())
      .add(campaignData);
  } catch (error) {
    console.log('error writing campaign to database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
