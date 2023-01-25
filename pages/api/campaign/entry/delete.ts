import { Converter, db } from '@/lib/db';
import { Entry } from '@/types';
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
    permissions,
  }: {
    entryID: string;
    worldID: string;
    campaignID: string;
    permissions: string[];
  } = JSON.parse(request.body);

  try {
    if (!permissions.includes('admin')) {
      console.log('user does not have permission for that action.');
      return;
    }
    const entriesRef = db
      .collection('worlds')
      .doc(worldID)
      .collection('campaigns')
      .doc(campaignID)
      .collection('entries');

    const entries = entriesRef.withConverter(new Converter<Entry>()).get();

    (await entries).docs.map(async (entry) => {
      const entryParentID = entry.data().parent?.id;
      if (entryParentID) {
        if (entryParentID === entryID) {
          await entriesRef
            .doc(entry.data().id)
            .withConverter(new Converter<Entry>())
            .update({ parent: FieldValue.delete() });
        }
      }
    });

    entriesRef.doc(entryID).withConverter(new Converter<Entry>()).delete();
  } catch (error) {
    console.log('error deleting campaign entry from database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
