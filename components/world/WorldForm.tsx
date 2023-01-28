'use client';

import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import { World, WorldForm } from '@/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

interface Props {
  sessionEmail: string;
  world?: World;
  permissions?: string[];
}

const createNewWorld = (sessionEmail: string): WorldForm => {
  return {
    name: '',
    description: '',
    image: '',
    readers: [sessionEmail],
    writers: [sessionEmail],
    admins: [sessionEmail],
    public: false,
    entries: [],
    campaigns: [],
  };
};

const WorldForm = ({ sessionEmail, world, permissions }: Props) => {
  const [worldForm, setWorldForm] = useState<World | WorldForm>(
    world ? world : createNewWorld(sessionEmail)
  );

  const router = useRouter();

  const onCreate = async () => {
    if (worldForm.name) {
      try {
        await fetch('/api/world/create', {
          method: 'POST',
          body: JSON.stringify(worldForm),
        }).then((res) =>
          res.json().then((worldID: string) => {
            router.push(`/world/${worldID}`);
            router.refresh();
          })
        );
      } catch (error) {
        console.log('error creating world: ', error);
      }
    }
  };

  const onUpdate = async () => {
    if (world) {
      if (worldForm.name) {
        try {
          await fetch('/api/world/update', {
            method: 'POST',
            body: JSON.stringify({
              worldData: worldForm,
              worldID: world.id,
              permissions,
            }),
          });
          router.push(`/world/${world.id}`);
          router.refresh();
        } catch (error) {
          console.log('error updating world: ', error);
        }
      }
    }
  };

  return (
    <>
      <Box
        component='form'
        sx={{
          '& .MuiTextField-root': { m: 1, width: '75ch' },
          width: '75ch',
        }}
      >
        <FormControl>
          <TextField
            required
            label='name'
            margin='normal'
            value={worldForm.name}
            onChange={(e) =>
              setWorldForm({ ...worldForm, name: e.target.value })
            }
          />
          <TextField
            label='description'
            multiline
            value={worldForm.description}
            onChange={(e) =>
              setWorldForm({ ...worldForm, description: e.target.value })
            }
          />
          {(permissions?.includes('admin') || !world) && (
            <>
              <Autocomplete
                multiple
                id='tags-filled'
                options={[]}
                freeSolo
                value={worldForm.admins}
                onChange={(event, value) =>
                  setWorldForm({
                    ...worldForm,
                    admins: [...value],
                    writers: [...new Set([...worldForm.writers, ...value])],
                    readers: [...new Set([...worldForm.readers, ...value])],
                  })
                }
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant='outlined'
                      label={option}
                      {...getTagProps({ index })}
                      disabled={option === sessionEmail}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='filled'
                    placeholder='admins'
                  />
                )}
              />
              <Autocomplete
                multiple
                id='tags-filled'
                options={[]}
                freeSolo
                value={worldForm.writers}
                onChange={(event, value) =>
                  setWorldForm({
                    ...worldForm,
                    writers: [...value],
                    readers: [...new Set([...worldForm.readers, ...value])],
                  })
                }
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant='outlined'
                      label={option}
                      {...getTagProps({ index })}
                      disabled={worldForm.admins.includes(option)}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='filled'
                    placeholder='writers'
                  />
                )}
              />
              <Autocomplete
                multiple
                id='tags-filled'
                options={[]}
                freeSolo
                value={worldForm.readers}
                onChange={(event, value) =>
                  setWorldForm({ ...worldForm, readers: [...value] })
                }
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant='outlined'
                      label={option}
                      {...getTagProps({ index })}
                      disabled={
                        worldForm.admins.includes(option) ||
                        worldForm.writers.includes(option)
                      }
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='filled'
                    placeholder='readers'
                  />
                )}
              />
              <FormControl component='fieldset'>
                <RadioGroup
                  value={worldForm.public}
                  onChange={() =>
                    setWorldForm({ ...worldForm, public: !worldForm.public })
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
            </>
          )}
          {world ? (
            <>
              <Button
                variant='contained'
                sx={{ margin: 1 }}
                onClick={() => onUpdate()}
              >
                Update World
              </Button>
            </>
          ) : (
            <Button
              variant='contained'
              sx={{ margin: 1 }}
              onClick={() => onCreate()}
            >
              Create World
            </Button>
          )}
          <Button onClick={() => router.back()}>Cancel</Button>
        </FormControl>
      </Box>
    </>
  );
};

export default WorldForm;
