'use client';

import { Lore, LoreForm } from '@/types';
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
  lore?: Lore;
}

const createNewLore = (): LoreForm => {
  return {
    title: '',
    description: '',
    public: false,
    plotPoint: 'Lore' as const,
  };
};

const LoreForm = ({ worldID, lore }: Props) => {
  const [loreForm, setLoreForm] = useState<Lore | LoreForm>(
    lore ? lore : createNewLore()
  );

  const router = useRouter();

  const onCreate = async () => {
    try {
      await fetch('/api/lore/create', {
        method: 'POST',
        body: JSON.stringify({ loreData: loreForm, worldID }),
      }).then((res) =>
        res.json().then((loreID: string) => {
          router.push(`/world/${worldID}/lore/${loreID}`);
          router.refresh();
        })
      );
    } catch (error) {
      console.log('error creating lore: ', error);
    }
  };

  const onUpdate = async () => {
    try {
      await fetch('/api/lore/update', {
        method: 'POST',
        body: JSON.stringify({
          loreData: loreForm,
          loreID: lore?.id,
          worldID,
        }),
      });
      router.push(`/world/${worldID}/lore/${lore?.id}`);
      router.refresh();
    } catch (error) {
      console.log('error updating lore: ', error);
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
          label='title'
          margin='normal'
          value={loreForm.title}
          onChange={(e) => setLoreForm({ ...loreForm, title: e.target.value })}
        />
        <TextField
          label='description'
          margin='normal'
          value={loreForm.description}
          onChange={(e) =>
            setLoreForm({ ...loreForm, description: e.target.value })
          }
        />
      </Box>
      <FormControl component='fieldset'>
        <RadioGroup
          value={loreForm.public}
          onChange={() =>
            setLoreForm({ ...loreForm, public: !loreForm.public })
          }
        >
          <FormControlLabel value={false} control={<Radio />} label='Private' />
          <FormControlLabel value={true} control={<Radio />} label='Public' />
        </RadioGroup>
      </FormControl>
      {lore ? (
        <Button onClick={() => onUpdate()}>Update Lore</Button>
      ) : (
        <Button onClick={() => onCreate()}>Create Lore</Button>
      )}
      <Button onClick={() => router.back()}>Cancel</Button>
    </>
  );
};

export default LoreForm;
