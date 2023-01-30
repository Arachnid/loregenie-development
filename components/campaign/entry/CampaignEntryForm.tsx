'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {
  Category,
  Entry,
  EntryForm,
  EntryHierarchy,
  isCategory,
} from '@/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { createEntryHierarchy } from '@/utils/createEntryHierarchy';

interface Props {
  worldID: string;
  campaignID: string;
  currentEntry?: Entry;
  campaignEntries: Entry[];
  permissions: string[];
}

const createNewEntry = (): EntryForm => {
  return {
    name: '',
    description: '',
    image: '',
    public: false,
    category: Category.Journal,
  };
};

const CampaignEntryForm = ({
  currentEntry,
  worldID,
  campaignID,
  campaignEntries,
  permissions,
}: Props) => {
  const [entryForm, setEntryForm] = useState<Entry | EntryForm>(
    currentEntry ? currentEntry : createNewEntry()
  );

  const router = useRouter();

  const onCreate = async () => {
    if (entryForm.name) {
      try {
        await fetch('/api/campaign/entry/create', {
          method: 'POST',
          body: JSON.stringify({
            entryData: entryForm,
            worldID,
            campaignID,
            permissions,
          }),
        }).then((res) =>
          res.json().then((entryID: string) => {
            router.push(
              `/world/${worldID}/campaign/${campaignID}/entry/${entryID}`
            );
            router.refresh();
          })
        );
      } catch (error) {
        console.log('error submitting campaign entry: ', error);
      }
    }
  };

  const onUpdate = async () => {
    if (entryForm.name) {
      try {
        await fetch('/api/campaign/entry/update', {
          method: 'POST',
          body: JSON.stringify({
            entryData: entryForm,
            entryID: currentEntry?.id,
            worldID: worldID,
            campaignID,
            permissions,
          }),
        });
        router.push(
          `/world/${worldID}/campaign/${campaignID}/entry/${currentEntry?.id}`
        );
        router.refresh();
      } catch (error) {
        console.log('error updating campaign entry: ', error);
      }
    }
  };

  const handleParent = (value: string) => {
    const parentValue = JSON.parse(value);
    if (!parentValue) {
      const { parent, ...state } = entryForm;
      setEntryForm(state);
    } else {
      setEntryForm({
        ...entryForm,
        parent: { name: parentValue.name, id: parentValue.id },
      });
    }
  };

  const handleCategory = (value: string) => {
    if (isCategory(value)) {
      setEntryForm({
        ...entryForm,
        category: value,
      });
    }
  };

  const getParents = (entries: Entry[]): EntryHierarchy[] => {
    const result: EntryHierarchy[] = [];
    const parentHierarchy: EntryHierarchy[] = createEntryHierarchy(entries);

    const recursiveEntryHierarchy = (entriesHierarchy: EntryHierarchy[]) => {
      entriesHierarchy.map((entry: EntryHierarchy) => {
        if (
          entry.id !== currentEntry?.id
        ) {
          if (entry.children) {
            result.push(entry);
            return recursiveEntryHierarchy(entry.children);
          }
          result.push(entry);
        }
      });
    };
    recursiveEntryHierarchy(parentHierarchy);
    return result;
  };

  return (
    <>
      <Box
        component='form'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '75ch',
        }}
      >
        <FormControl>
          {!currentEntry && (
            <FormControl margin='normal'>
              <InputLabel>Category</InputLabel>
              <Select
                value={entryForm.category}
                label='Category'
                onChange={(e) => handleCategory(e.target.value)}
              >
                <MenuItem value={Category.Journal}>Journal</MenuItem>
              </Select>
            </FormControl>
          )}
          <TextField
            required
            label='name'
            margin='normal'
            value={entryForm.name}
            onChange={(e) =>
              setEntryForm({ ...entryForm, name: e.target.value })
            }
          />
          <TextField
            label='description'
            margin='normal'
            multiline
            value={entryForm.description}
            onChange={(e) =>
              setEntryForm({ ...entryForm, description: e.target.value })
            }
          />
          <FormControl margin='normal'>
            <InputLabel>Parent</InputLabel>
            <Select
              value={entryForm.parent ? JSON.stringify(entryForm.parent) : ''}
              label='Parent'
              onChange={(e) => handleParent(e.target.value)}
            >
              {getParents(campaignEntries).map((entry, index) => {
                return (
                  <MenuItem
                    key={index}
                    value={JSON.stringify({ name: entry.name, id: entry.id })}
                  >
                    {entry.name}
                  </MenuItem>
                );
              })}
              <MenuItem value={JSON.stringify('')}>None</MenuItem>
            </Select>
          </FormControl>
          <FormControl component='fieldset'>
            <RadioGroup
              value={entryForm.public}
              onChange={() =>
                setEntryForm({ ...entryForm, public: !entryForm.public })
              }
            >
              <FormControlLabel
                value={false}
                control={<Radio />}
                label='Private'
              />
              <FormControlLabel
                value={true}
                control={<Radio />}
                label='Public'
              />
            </RadioGroup>
          </FormControl>
          {currentEntry ? (
            <Button
              variant='contained'
              sx={{ margin: 1 }}
              onClick={() => onUpdate()}
            >
              Update Entry
            </Button>
          ) : (
            <Button
              variant='contained'
              sx={{ margin: 1 }}
              onClick={() => onCreate()}
            >
              Create Entry
            </Button>
          )}
          <Button onClick={() => router.back()}>Cancel</Button>
        </FormControl>
      </Box>
    </>
  );
};

export default CampaignEntryForm;