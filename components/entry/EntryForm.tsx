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
  World,
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
import { createParentHierarchy } from '@/utils/createParentHierarchy';

interface Props {
  world: World;
  currentEntry?: Entry;
  entries: Entry[];
  permissions: string[];
}

const createNewEntry = (): EntryForm => {
  return {
    name: '',
    description: '',
    image: '',
    public: false,
    category: Category.NPC,
  };
};

const EntryForm = ({ currentEntry, world, entries, permissions }: Props) => {
  const [entryForm, setEntryForm] = useState<Entry | EntryForm>(
    currentEntry ? currentEntry : createNewEntry()
  );

  const router = useRouter();

  const onCreate = async () => {
    try {
      await fetch('/api/entry/create', {
        method: 'POST',
        body: JSON.stringify({
          entryData: entryForm,
          worldID: world.id,
          permissions,
        }),
      }).then((res) =>
        res.json().then((entryID: string) => {
          router.push(`/world/${world.id}/entry/${entryID}`);
          router.refresh();
        })
      );
    } catch (error) {
      console.log('error submitting entry: ', error);
    }
  };

  const onUpdate = async () => {
    try {
      await fetch('/api/entry/update', {
        method: 'POST',
        body: JSON.stringify({
          entryData: entryForm,
          entryID: currentEntry?.id,
          worldID: world.id,
          permissions,
        }),
      });
      router.push(`/world/${world.id}/entry/${currentEntry?.id}`);
      router.refresh();
    } catch (error) {
      console.log('error updating entry: ', error);
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
    const parentHierarchy: EntryHierarchy[] = createParentHierarchy(entries);

    const recursiveEntryHierarchy = (entriesHierarchy: EntryHierarchy[]) => {
      entriesHierarchy.map((entry: EntryHierarchy) => {
        if (
          entry.id !== currentEntry?.id &&
          entry.category === Category.Location
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
          <InputLabel>Category</InputLabel>
          <Select
            value={entryForm.category}
            label='Category'
            onChange={(e) => handleCategory(e.target.value)}
          >
            <MenuItem value={'NPC' as const}>NPC</MenuItem>
            <MenuItem value={'Location' as const}>Location</MenuItem>
            <MenuItem value={'Lore' as const}>Lore</MenuItem>
            <MenuItem value={'Journal' as const}>Journal</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label='name'
          margin='normal'
          value={entryForm.name}
          onChange={(e) => setEntryForm({ ...entryForm, name: e.target.value })}
        />
        <TextField
          label='description'
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
            {getParents(entries).map((entry, index) => {
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
            <FormControlLabel value={true} control={<Radio />} label='Public' />
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
      </Box>
    </>
  );
};

export default EntryForm;
