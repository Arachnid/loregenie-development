import { Converter, db } from '@/lib/db';
import { Entry } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const {
    entryData,
    worldID,
    permissions,
  }: { entryData: Entry; worldID: string; permissions: string[] } = JSON.parse(
    request.body
  );
  try {
    if (!permissions.includes('writer')) {
      console.log('user does not have permission for that action.');
      return;
    }
    const entry = await db
      .collection('worlds')
      .doc(worldID)
      .collection('entries')
      .withConverter(new Converter<Entry>())
      .add(entryData);
    response.json(entry.id);
  } catch (error) {
    console.log('error writing entry to database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
}
