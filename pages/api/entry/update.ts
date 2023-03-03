import admin from 'firebase-admin';
import { Converter, db } from '@/lib/db';
import { Entry, PermissionLevel, World } from '@/types';
import { hasPermission } from '@/utils/validation/hasPermission';
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

    let docRef: admin.firestore.DocumentReference<World | Entry> = db
      .collection('worlds')
      .doc(worldID)
      .withConverter(new Converter<World>());

    if (entryData.campaign) {
      docRef = docRef
        .collection('campaigns')
        .doc(entryData.campaign.id)
        .collection('entries')
        .doc(entryData.id)
        .withConverter(new Converter<Entry>());
    } else {
      docRef = docRef
        .collection('entries')
        .doc(entryData.id)
        .withConverter(new Converter<Entry>());
    }

    await docRef.set(entryData);
  } catch (error) {
    console.log('error updating entry to database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
