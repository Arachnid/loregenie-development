import { Converter, db } from '@/lib/db';
import { JournalEntry } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const {
    journalEntryData,
    worldID,
    campaignID,
  }: { journalEntryData: JournalEntry; worldID: string; campaignID: string } =
    JSON.parse(request.body);
  try {
    const journalEntry = await db
      .collection('worlds')
      .doc(worldID)
      .collection('campaigns')
      .doc(campaignID)
      .collection('journalEntries')
      .withConverter(new Converter<JournalEntry>())
      .add(journalEntryData);
    response.json(journalEntry.id);
  } catch (error) {
    console.log('error writing journal entry to database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
}
