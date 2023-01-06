'use client';

import { JournalEntry } from '@/types';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

interface Props {
  journalEntry: JournalEntry;
  worldID: string;
  campaignID: string;
}

const ClientJournalEntryPage = ({ journalEntry, worldID, campaignID }: Props) => {
  const router = useRouter();

  const onDelete = async () => {
    try {
      await fetch('/api/journalEntry/delete', {
        method: 'POST',
        body: JSON.stringify({
          journalEntryID: journalEntry.id,
          campaignID,
          worldID,
        }),
      });
      router.push(`/world/${worldID}/campaign/${campaignID}`);
      router.refresh();
    } catch (error) {
      console.log('error deleting journal entry: ', error);
    }
  };

  return (
    <>
      <h1>date: {journalEntry.date}</h1>
      <div>text: {journalEntry.text}</div>
      <div>visibility: {journalEntry.public ? 'public' : 'private'}</div>
      <Button
        color='error'
        variant='contained'
        sx={{ margin: 1 }}
        onClick={() => onDelete()}
      >
        Delete Journal Entry
      </Button>
      <Button
        variant='contained'
        onClick={() =>
          router.push(`/world/${worldID}/campaign/${campaignID}/journalEntry/${journalEntry.id}/edit`)
        }
      >
        Edit Journal Entry
      </Button>
      <Button onClick={() => router.push(`/world/${worldID}/campaign/${campaignID}`)}>
        Return To Campaign
      </Button>
    </>
  );
};

export default ClientJournalEntryPage;
