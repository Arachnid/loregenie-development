import { Converter, db } from '@/lib/db';
import { JournalEntry } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const {
    journalEntryData,
    journalEntryID,
    worldID,
    campaignID,
  }: {
    journalEntryData: JournalEntry;
    journalEntryID: string;
    worldID: string;
    campaignID: string;
  } = JSON.parse(request.body);
  try {
    await db
      .collection('worlds')
      .doc(worldID)
      .collection('campaigns')
      .doc(campaignID)
      .collection('journalEntries')
      .doc(journalEntryID)
      .withConverter(new Converter<JournalEntry>())
      .update(journalEntryData);
  } catch (error) {
    console.log('error updating journal entry to database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
