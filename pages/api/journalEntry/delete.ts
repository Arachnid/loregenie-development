import { Converter, db } from '@/lib/db';
import { JournalEntry } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const {
    journalEntryID,
    campaignID,
    worldID,
  }: { journalEntryID: string; campaignID: string; worldID: string } =
    JSON.parse(request.body);

  try {
    await db
      .collection('worlds')
      .doc(worldID)
      .collection('campaigns')
      .doc(campaignID)
      .collection('journalEntries')
      .doc(journalEntryID)
      .withConverter(new Converter<JournalEntry>())
      .delete();
  } catch (error) {
    console.log('error deleting journal entry from database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
