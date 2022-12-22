import { Converter, db } from '@/lib/db';
import { ExtendedCampaign } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    await db.collection('campaigns').withConverter(new Converter<ExtendedCampaign>()).add(JSON.parse(request.body));
  } catch (error) {
    console.log('error writing campaign to database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
