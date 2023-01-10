'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Entry, EntryForm, World } from '@/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

interface Props {
  world: World;
  currentEntry?: Entry;
  entries: Entry[];
}

const createNewEntry = (world: World): EntryForm => {
  return {
    name: '',
    description: '',
    image: '',
    public: false,
    parent: {
      name: world.name,
      id: world.id,
    },
    category: 'NPC' as const,
  };
};

const EntryForm = ({ currentEntry, world, entries }: Props) => {
  const [entryForm, setEntryForm] = useState<Entry | EntryForm>(
    currentEntry ? currentEntry : createNewEntry(world)
  );

  const router = useRouter();

  const onCreate = async () => {
    try {
      await fetch('/api/entry/create', {
        method: 'POST',
        body: JSON.stringify({ entryData: entryForm, worldID: world.id }),
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
        }),
      });
      router.push(`/world/${world.id}/entry/${currentEntry?.id}`);
    } catch (error) {
      console.log('error updating entry: ', error);
    }
  };

  const handleParent = (value: string) => {
    const parentValue = JSON.parse(value);
    setEntryForm({
      ...entryForm,
      parent: { name: parentValue.name, id: parentValue.id },
    });
  };
  const handleCategory = (value: string) => {
    let category;
    
    if (value === 'NPC') {
      category = 'NPC' as const;
    } else if (value === 'Location') {
      category = 'Location' as const;
    } else if (value === 'Lore') {
      category = 'Lore' as const;
    } else {
      category = 'Journal' as const;
    }
    setEntryForm({ ...entryForm, category });
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
            value={JSON.stringify(entryForm.parent)}
            label='Parent'
            onChange={(e) => handleParent(e.target.value)}
          >
            {entries.map((entry, index) => {
              return (
                <MenuItem
                  key={index}
                  value={JSON.stringify({ name: entry.name, id: entry.id })}
                >
                  {entry.name}
                </MenuItem>
              );
            })}
            <MenuItem
              value={JSON.stringify({ name: world.name, id: world.id })}
            >
              {world.name}
            </MenuItem>
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
