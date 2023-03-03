import admin from 'firebase-admin';
import { Converter, db } from '@/lib/db';
import { Entry, PermissionLevel, World } from '@/types';
import { hasPermission } from '@/utils/validation/hasPermission';
import { FieldValue } from 'firebase-admin/firestore';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const {
    entryID,
    worldID,
    campaignID,
  }: { entryID: string; worldID: string; campaignID?: string } = JSON.parse(
    request.body
  );

  try {
    if (
      !(await hasPermission(request, response, worldID, PermissionLevel.admin))
    ) {
      response.statusCode = 500;
      response.send({});
      return;
    }

    let collectionRef: admin.firestore.CollectionReference<Entry> = db
      .collection('worlds')
      .withConverter(new Converter<World>());

    if (campaignID) {
      collectionRef = collectionRef
        .doc(worldID)
        .collection('campaigns')
        .doc(campaignID)
        .collection('entries')
        .withConverter(new Converter<Entry>());
    } else {
      collectionRef = collectionRef
        .doc(worldID)
        .collection('entries')
        .withConverter(new Converter<Entry>());
    }

    const entries = await collectionRef.get();

    entries.docs.map(async (entry) => {
      const entryParentID = entry.data().parent?.id;
      if (entryParentID) {
        if (entryParentID === entryID) {
          await collectionRef
            .doc(entry.data().id)
            .withConverter(new Converter<Entry>())
            .update({ parent: FieldValue.delete() });
        }
      }
    });

    collectionRef.doc(entryID).withConverter(new Converter<Entry>()).delete();
  } catch (error) {
    console.log('error deleting entry from database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
