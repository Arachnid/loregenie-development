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
      !(await hasPermission(
        request,
        response,
        worldID,
        PermissionLevel.writer,
        entryData.campaign?.id as string
      ))
    ) {
      response.statusCode = 500;
      response.send({});
      return;
    }
    const entry = await db
      .collection('worlds')
      .doc(worldID)
      .collection('campaigns')
      .doc(entryData.campaign?.id as string)
      .collection('entries')
      .withConverter(new Converter<Entry>())
      .add(entryData);
    response.json((await entry.get()).data());
  } catch (error) {
    console.log('error writing campaign entry to database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
}
