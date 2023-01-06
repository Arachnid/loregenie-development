import JournalEntryForm from '@/components/journalEntry/JournalEntryForm';
import { getJournalEntry } from '@/lib/db';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { JournalEntry } from '@/types';
import { Session, unstable_getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import React from 'react';

interface Props {
  params: {
    worldID: string;
    campaignID: string;
    journalEntryID: string;
  };
}

const EditJournalEntryPage = async ({ params }: Props) => {
  const journalEntry: JournalEntry | undefined = await getJournalEntry(
    params.worldID,
    params.campaignID,
    params.journalEntryID
  );
  const session: Session | null = await unstable_getServerSession(authOptions);

  if (!journalEntry || !session?.user?.email) {
    notFound();
  }

  return (
    <JournalEntryForm
      journalEntry={journalEntry}
      campaignID={params.campaignID}
      worldID={params.worldID}
    />
  );
};

export default EditJournalEntryPage;
