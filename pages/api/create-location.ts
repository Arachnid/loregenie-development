import { Converter, db } from '@/lib/db';
import { Location, NPC } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const data = JSON.parse(request.body);
  try {
    const locationCollection = await db
      .collection('locations')
      .withConverter(new Converter<Location>())
      .add(data);
    console.log('create location in locations collection:', locationCollection);
    const locationNav = await db
    .collection('campaigns')
    .doc(data.campaign)
  } catch (error) {
    console.log('error writing location to database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
