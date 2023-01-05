import { Converter, db } from '@/lib/db';
import { Campaign } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { campaignID, settingID }: { campaignID: string; settingID: string } =
    JSON.parse(request.body);

  try {
    await db
      .collection('settings')
      .doc(settingID)
      .collection('campaigns')
      .doc(campaignID)
      .withConverter(new Converter<Campaign>())
      .delete();
  } catch (error) {
    console.log('error deleting campaign from database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
