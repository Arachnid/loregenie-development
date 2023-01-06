'use client';

import { JournalEntry, JournalEntryForm } from '@/types';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

interface Props {
  worldID: string;
  campaignID: string;
  journalEntry?: JournalEntry;
}

const createNewJournalEntry = (): JournalEntryForm => {
  return {
    date: '',
    text: '',
    public: false,
  };
};

const JournalEntryForm = ({ worldID, journalEntry, campaignID }: Props) => {
  const [journalEntryForm, setJournalEntryForm] = useState<
    JournalEntry | JournalEntryForm
  >(journalEntry ? journalEntry : createNewJournalEntry());

  const router = useRouter();

  const onCreate = async () => {
    try {
      await fetch('/api/journalEntry/create', {
        method: 'POST',
        body: JSON.stringify({
          journalEntryData: journalEntryForm,
          worldID,
          campaignID,
        }),
      }).then((res) =>
        res.json().then((journalEntryID: string) => {
          router.push(
            `/world/${worldID}/campaign/${campaignID}/journalEntry/${journalEntryID}`
          );
          router.refresh();
        })
      );
    } catch (error) {
      console.log('error creating journal entry: ', error);
    }
  };

  const onUpdate = async () => {
    try {
      await fetch('/api/journalEntry/update', {
        method: 'POST',
        body: JSON.stringify({
          journalEntryData: journalEntryForm,
          journalEntryID: journalEntry?.id,
          worldID,
          campaignID,
        }),
      });
      router.push(
        `/world/${worldID}/campaign/${campaignID}/journalEntry/${journalEntry?.id}`
      );
      router.refresh();
    } catch (error) {
      console.log('error updating journal entry: ', error);
    }
  };

  return (
    <>
      <Box
        component='form'
        sx={{
          '& .MuiTextField-root': {
            m: 1,
            width: '75ch',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <TextField
          label='date'
          margin='normal'
          value={journalEntryForm.date}
          onChange={(e) =>
            setJournalEntryForm({ ...journalEntryForm, date: e.target.value })
          }
        />
        <TextField
          label='text'
          margin='normal'
          value={journalEntryForm.text}
          onChange={(e) =>
            setJournalEntryForm({ ...journalEntryForm, text: e.target.value })
          }
        />
      </Box>
      <FormControl component='fieldset'>
        <RadioGroup
          value={journalEntryForm.public}
          onChange={() =>
            setJournalEntryForm({
              ...journalEntryForm,
              public: !journalEntryForm.public,
            })
          }
        >
          <FormControlLabel value={false} control={<Radio />} label='Private' />
          <FormControlLabel value={true} control={<Radio />} label='Public' />
        </RadioGroup>
      </FormControl>
      {journalEntry ? (
        <Button onClick={() => onUpdate()}>Update Journal Entry</Button>
      ) : (
        <Button onClick={() => onCreate()}>Create Journal Entry</Button>
      )}
      <Button onClick={() => router.back()}>Cancel</Button>
    </>
  );
};

export default JournalEntryForm;
