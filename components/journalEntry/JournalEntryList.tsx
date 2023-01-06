'use client';

import { JournalEntry } from '@/types';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Props = {
  journalEntries: JournalEntry[];
  worldID: string;
  campaignID: string;
};

const JournalEntryList = ({ journalEntries, worldID, campaignID }: Props) => {
  const router = useRouter();
  return (
    <>
      <h2>Journal Entries</h2>
      <List>
        {journalEntries.map((journalEntry, index) => {
          return (
            <ListItem key={index}>
              <Link
                href={`/world/${worldID}/campaign/${campaignID}/journalEntry/${journalEntry.id}`}
              >
                {journalEntry.date}
              </Link>
            </ListItem>
          );
        })}
      </List>
      <Button
        onClick={() =>
          router.push(
            `world/${worldID}/campaign/${campaignID}/journalEntry/new`
          )
        }
      >
        Create Journal Entry
      </Button>
    </>
  );
};

export default JournalEntryList;
