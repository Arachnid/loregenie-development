import { Converter, db } from '@/lib/db';
import { Entry, PermissionLevel } from '@/types';
import { hasPermission } from '@/utils/hasPermission';
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
  }: {
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
        PermissionLevel.admin,
        campaignID
      ))
    ) {
      response.statusCode = 500;
      response.send({});
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
