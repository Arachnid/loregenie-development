'use client';

import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import { Setting } from '@/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

interface Props {
  sessionEmail: string;
  setting?: Setting;
}

const editExistingOrNewSetting = (
  setting: Setting | undefined,
  sessionEmail: string
) => {
  if (setting) {
    return setting;
  }
  return {
    name: '',
    description: '',
    readers: [sessionEmail],
    writers: [sessionEmail],
    admins: [sessionEmail],
    public: false,
  };
};

const SettingForm = ({ sessionEmail, setting }: Props) => {
  const [settingForm, setSettingForm] = useState<Setting>(
    editExistingOrNewSetting(setting, sessionEmail)
  );

  const router = useRouter();

  const onCreate = async () => {
    try {
      await fetch('/api/setting/create', {
        method: 'POST',
        body: JSON.stringify(settingForm),
      });
      router.push(`/`);
      router.refresh();
    } catch (error) {
      console.log('error creating setting: ', error);
    }
  };

  const onUpdate = async () => {
    if (setting) {
      try {
        await fetch('/api/setting/update', {
          method: 'POST',
          body: JSON.stringify({
            settingData: settingForm,
            settingID: setting.id,
          }),
        });
        router.push(`/setting/${setting.id}`);
        router.refresh();
      } catch (error) {
        console.log('error updating setting: ', error);
      }
    }
  };

  const onDelete = async () => {
    if (setting) {
      try {
        await fetch('/api/setting/delete', {
          method: 'POST',
          body: setting.id,
        });
        router.push('/');
        router.refresh();
      } catch (error) {
        console.log('error deleting setting: ', error);
      }
    }
  };

  return (
    <>
      <Box
        component='form'
        sx={{
          '& .MuiTextField-root': { m: 1, width: '75ch' },
        }}
      >
        <TextField
          label='name'
          margin='normal'
          value={settingForm.name}
          onChange={(e) =>
            setSettingForm({ ...settingForm, name: e.target.value })
          }
        />
        <TextField
          label='description'
          multiline
          value={settingForm.description}
          onChange={(e) =>
            setSettingForm({ ...settingForm, description: e.target.value })
          }
        />
        <Autocomplete
          multiple
          id='tags-filled'
          options={[]}
          freeSolo
          value={settingForm.readers}
          onChange={(event, value) =>
            setSettingForm({ ...settingForm, readers: value })
          }
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
            <TextField {...params} variant='filled' placeholder='readers' />
          )}
        />
        <Autocomplete
          multiple
          id='tags-filled'
          options={[]}
          freeSolo
          value={settingForm.writers}
          onChange={(event, value) =>
            setSettingForm({ ...settingForm, writers: value })
          }
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
            <TextField {...params} variant='filled' placeholder='writers' />
          )}
        />
        <Autocomplete
          multiple
          id='tags-filled'
          options={[]}
          freeSolo
          value={settingForm.admins}
          onChange={(event, value) =>
            setSettingForm({ ...settingForm, admins: value })
          }
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
            <TextField {...params} variant='filled' placeholder='admins' />
          )}
        />
        <FormControl component='fieldset'>
          <RadioGroup
            value={settingForm.public}
            onChange={() =>
              setSettingForm({ ...settingForm, public: !settingForm.public })
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
        {setting ? (
          <>
            <Button
              variant='contained'
              sx={{ margin: 1 }}
              onClick={() => onUpdate()}
            >
              Update Setting
            </Button>
            <Button
              variant='contained'
              color='error'
              sx={{ margin: 1 }}
              onClick={() => onDelete()}
            >
              Delete Setting
            </Button>
          </>
        ) : (
          <Button
            variant='contained'
            sx={{ margin: 1 }}
            onClick={() => onCreate()}
          >
            Create Setting
          </Button>
        )}
        <Button onClick={() => router.back()}>Cancel</Button>
      </Box>
    </>
  );
};

export default SettingForm;
