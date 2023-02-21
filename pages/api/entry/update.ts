import { Converter, db } from '@/lib/db';
import { Entry, PermissionLevel } from '@/types';
import { hasPermission } from '@/utils/hasPermission';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const {
    entryData,
    worldID,
  }: {
    entryData: Entry;
    worldID: string;
  } = JSON.parse(request.body);
  
  try {
    if (
      !(await hasPermission(request, response, worldID, PermissionLevel.writer))
    ) {
      response.statusCode = 500;
      response.send({});
      return;
    }
    await db
      .collection('worlds')
      .doc(worldID)
      .collection('entries')
      .doc(entryData.id)
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
