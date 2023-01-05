import { Converter, db } from '@/lib/db';
import { Location } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const {
    locationData,
    locationID,
    settingID,
  }: { locationData: Location; locationID: string; settingID: string } =
    JSON.parse(request.body);
  try {
    await db
      .collection('settings')
      .doc(settingID)
      .collection('plotPoints')
      .doc(locationID)
      .withConverter(new Converter<Location>())
      .update(locationData);
  } catch (error) {
    console.log('error updating location to database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
