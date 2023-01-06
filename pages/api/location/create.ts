import { Converter, db } from '@/lib/db';
import { LocationForm, Forms } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const {
    locationData,
    worldID,
  }: { locationData: LocationForm; worldID: string } = JSON.parse(request.body);
  try {
    const location = await db
      .collection('worlds')
      .doc(worldID)
      .collection('plotPoints')
      .withConverter(new Converter<Forms>())
      .add(locationData);
    response.json(location.id);
  } catch (error) {
    console.log('error writing location to database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
}
