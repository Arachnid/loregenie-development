import { Converter, db } from '@/lib/db';
import { Entry } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const {
    entryData,
    entryID,
    worldID,
    permissions,
  }: {
    entryData: Entry;
    entryID: string;
    worldID: string;
    permissions: string[];
  } = JSON.parse(request.body);
  try {
    if (!permissions.includes('writer')) {
      console.log('user does not have permission for that action.');
      return;
    }
    await db
      .collection('worlds')
      .doc(worldID)
      .collection('entries')
      .doc(entryID)
      .withConverter(new Converter<Entry>())
      .set(entryData);
  } catch (error) {
    console.log('error updating entry to database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
