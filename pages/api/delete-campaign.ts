import { Converter, db } from '@/lib/db';
import { ExtendedCampaign } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const campaignID = request.body;

  try {
    await db.collection('campaigns').doc(campaignID).withConverter(new Converter<ExtendedCampaign>()).delete();
  } catch (error) {
    console.log('error deleting campaign from database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
