'use client';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { NPC } from '@/types';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import { useRouter } from 'next/navigation';

interface Props {
  settingID: string;
  npc?: NPC;
}

const editExistingOrNewNPC = (npc: NPC | undefined) => {
  if (npc) {
    return npc;
  }
  return {
    name: '',
    gender: '',
    age: 0,
    race: '',
    profession: '',
    alignment: '',
    appearance: '',
    background: '',
    diction: '',
    personality: '',
    summary: '',
    bonds: [],
    ideals: [],
    flaws: [],
    public: false,
    plotPoint: 'NPC' as const,
  };
};

const NPCForm = ({ settingID, npc }: Props) => {
  const [npcForm, setNpcForm] = useState<NPC>(editExistingOrNewNPC(npc));

  const router = useRouter();

  const onUpdate = async () => {
    try {
      await fetch('/api/npc/update', {
        method: 'POST',
        body: JSON.stringify({
          npcData: npcForm,
          npcID: npc?.id,
          settingID,
        }),
      });
      router.push(`/setting/${settingID}/npc/${npc?.id}`);
      router.refresh();
    } catch (error) {
      console.log('error updating npc: ', error);
    }
  };
  const onCreate = async () => {
    try {
      await fetch('/api/npc/create', {
        method: 'POST',
        body: JSON.stringify({ npcData: npcForm, settingID }),
      });
      router.push(`/setting/${settingID}`);
      router.refresh();
    } catch (error) {
      console.log('error creating npc: ', error);
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
          label='name'
          margin='normal'
          value={npcForm.name}
          onChange={(e) => setNpcForm({ ...npcForm, name: e.target.value })}
        />
        <TextField
          label='gender'
          margin='normal'
          value={npcForm.gender}
          onChange={(e) => setNpcForm({ ...npcForm, gender: e.target.value })}
        />
        <TextField
          label='age (years)'
          margin='normal'
          type='number'
          value={npcForm.age ? npcForm.age : ''}
          onChange={(e) =>
            setNpcForm({ ...npcForm, age: Number(e.target.value) })
          }
        />
        <TextField
          label='race'
          margin='normal'
          value={npcForm.race}
          onChange={(e) => setNpcForm({ ...npcForm, race: e.target.value })}
        />
        <TextField
          label='profession'
          margin='normal'
          value={npcForm.profession}
          onChange={(e) =>
            setNpcForm({ ...npcForm, profession: e.target.value })
          }
        />
        <TextField
          label='alignment'
          margin='normal'
          value={npcForm.alignment}
          onChange={(e) =>
            setNpcForm({ ...npcForm, alignment: e.target.value })
          }
        />
        <TextField
          label='appearance'
          margin='normal'
          value={npcForm.appearance}
          onChange={(e) =>
            setNpcForm({ ...npcForm, appearance: e.target.value })
          }
        />
        <TextField
          label='background'
          margin='normal'
          value={npcForm.background}
          onChange={(e) =>
            setNpcForm({ ...npcForm, background: e.target.value })
          }
        />
        <TextField
          label='diction'
          margin='normal'
          value={npcForm.diction}
          onChange={(e) => setNpcForm({ ...npcForm, diction: e.target.value })}
        />
        <TextField
          label='personality'
          margin='normal'
          value={npcForm.personality}
          onChange={(e) =>
            setNpcForm({ ...npcForm, personality: e.target.value })
          }
        />
        <TextField
          label='summary'
          margin='normal'
          multiline
          value={npcForm.summary}
          onChange={(e) => setNpcForm({ ...npcForm, summary: e.target.value })}
        />
        <Autocomplete
          multiple
          id='tags-filled'
          options={[]}
          freeSolo
          value={npcForm.bonds}
          onChange={(event, value) => setNpcForm({ ...npcForm, bonds: value })}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant='outlined'
                label={option}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} variant='filled' placeholder='bonds' />
          )}
        />
        <Autocomplete
          multiple
          id='tags-filled'
          options={[]}
          freeSolo
          value={npcForm.ideals}
          onChange={(event, value) => setNpcForm({ ...npcForm, ideals: value })}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant='outlined'
                label={option}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} variant='filled' placeholder='ideals' />
          )}
        />
        <Autocomplete
          multiple
          id='tags-filled'
          options={[]}
          freeSolo
          value={npcForm.flaws}
          onChange={(event, value) => setNpcForm({ ...npcForm, flaws: value })}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant='outlined'
                label={option}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} variant='filled' placeholder='flaws' />
          )}
        />
        <FormControl component='fieldset'>
          <RadioGroup
            value={npcForm.public}
            onChange={() => setNpcForm({ ...npcForm, public: !npcForm.public })}
          >
            <FormControlLabel
              value={false}
              control={<Radio />}
              label='Private'
            />
            <FormControlLabel value={true} control={<Radio />} label='Public' />
          </RadioGroup>
        </FormControl>
        {npc ? (
          <Button
            variant='contained'
            sx={{ margin: 1 }}
            onClick={() => onUpdate()}
          >
            Update NPC
          </Button>
        ) : (
          <Button
            variant='contained'
            sx={{ margin: 1 }}
            onClick={() => onCreate()}
          >
            Create NPC
          </Button>
        )}
        <Button onClick={() => router.back()}>Cancel</Button>
      </Box>
    </>
  );
};

export default NPCForm;
