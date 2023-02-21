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
    entryID,
    worldID,
    campaignID,
  }: {
    entryData: Entry;
    entryID: string;
    worldID: string;
    campaignID: string;
  } = JSON.parse(request.body);

  try {
    if (
      !(await hasPermission(
        request,
        response,
        worldID,
        PermissionLevel.writer,
        campaignID
      ))
    ) {
      response.statusCode = 500;
      response.send({});
      return;
    }
    await db
      .collection('worlds')
      .doc(worldID)
      .collection('campaigns')
      .doc(campaignID)
      .collection('entries')
      .doc(entryID)
      .withConverter(new Converter<Entry>())
      .set(entryData);
  } catch (error) {
    console.log('error updating campaign entry to database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
