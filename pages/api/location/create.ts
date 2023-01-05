import { Converter, db } from '@/lib/db';
import { PlotPoints, Location } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const {
    locationData,
    settingID,
  }: { locationData: Location; settingID: string } = JSON.parse(request.body);
  try {
    await db
      .collection('settings')
      .doc(settingID)
      .collection('plotPoints')
      .withConverter(new Converter<PlotPoints>())
      .add(locationData);
  } catch (error) {
    console.log('error writing location to database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
