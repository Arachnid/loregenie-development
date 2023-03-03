import admin from 'firebase-admin';
import { Converter, db } from '@/lib/db';
import { Entry, PermissionLevel, World } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { hasPermission } from '@/utils/validation/hasPermission';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { entryData, worldID }: { entryData: Entry; worldID: string } =
    JSON.parse(request.body);

  try {
    if (
      !(await hasPermission(request, response, worldID, PermissionLevel.writer))
    ) {
      response.statusCode = 500;
      response.send({});
      return;
    }

    let collectionRef: admin.firestore.CollectionReference<Entry | World> = db
      .collection('worlds')
      .withConverter(new Converter<World>());

    if (entryData.campaign) {
      collectionRef = collectionRef
        .doc(worldID)
        .collection('campaigns')
        .doc(entryData.campaign.id)
        .collection('entries')
        .withConverter(new Converter<Entry>());
    } else {
      collectionRef = collectionRef
        .doc(worldID)
        .collection('entries')
        .withConverter(new Converter<Entry>());
    }

    const entry = await collectionRef.add(entryData);

    response.json((await entry.get()).data());
  } catch (error) {
    console.log('error writing entry to database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
}
