import { Converter, db } from '@/lib/db';
import { Location } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { locationID, worldID }: { locationID: string; worldID: string } =
    JSON.parse(request.body);

  try {
    await db
      .collection('worlds')
      .doc(worldID)
      .collection('plotPoints')
      .doc(locationID)
      .withConverter(new Converter<Location>())
      .delete();
  } catch (error) {
    console.log('error deleting location from database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
