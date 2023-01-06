import { getJournalEntry } from '@/lib/db';
import { notFound } from 'next/navigation';
import { JournalEntry } from '@/types';
import ClientJournalEntryPage from '@/components/journalEntry/ClientJournalEntryPage';

interface Props {
  params: {
    worldID: string;
    campaignID: string;
    journalEntryID: string;
  };
}

export default async function JournalEntryPage({ params }: Props) {
  const journalEntry: JournalEntry | undefined = await getJournalEntry(
    params.worldID,
    params.campaignID,
    params.journalEntryID
  );
  if (!journalEntry) {
    notFound();
  }
  return (
    <ClientJournalEntryPage
      journalEntry={journalEntry}
      campaignID={params.campaignID}
      worldID={params.worldID}
    />
  );
}
