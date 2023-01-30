'use client';

import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import { Campaign, CampaignForm } from '@/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

interface Props {
  sessionEmail: string;
  worldID: string;
  campaign?: Campaign;
  permissions: string[];
}

const createNewCampaign = (sessionEmail: string): CampaignForm => {
  return {
    name: '',
    description: '',
    readers: [sessionEmail],
    writers: [sessionEmail],
    admins: [sessionEmail],
    public: false,
    entries: [],
  };
};

const CampaignForm = ({
  sessionEmail,
  campaign,
  worldID,
  permissions,
}: Props) => {
  const [campaignForm, setCampaignForm] = useState<Campaign | CampaignForm>(
    campaign ? campaign : createNewCampaign(sessionEmail)
  );

  const router = useRouter();

  const onCreate = async () => {
    if (campaignForm.name) {
      try {
        await fetch('/api/campaign/create', {
          method: 'POST',
          body: JSON.stringify({
            campaignData: campaignForm,
            worldID,
            permissions,
          }),
        }).then((res) =>
          res.json().then((campaignID: string) => {
            router.push(`/world/${worldID}/campaign/${campaignID}`);
            router.refresh();
          })
        );
      } catch (error) {
        console.log('error submitting campaign: ', error);
      }
    }
  };

  const onUpdate = async () => {
    if (campaignForm.name) {
      try {
        await fetch('/api/campaign/update', {
          method: 'POST',
          body: JSON.stringify({
            campaignData: campaignForm,
            campaignID: campaign?.id,
            worldID,
            permissions,
          }),
        });
        router.push(`/world/${worldID}/campaign/${campaign?.id}`);
        router.refresh();
      } catch (error) {
        console.log('error updating campaign: ', error);
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
            value={campaignForm.name}
            onChange={(e) =>
              setCampaignForm({ ...campaignForm, name: e.target.value })
            }
          />
          <TextField
            label='description'
            multiline
            value={campaignForm.description}
            onChange={(e) =>
              setCampaignForm({ ...campaignForm, description: e.target.value })
            }
          />
          {(permissions?.includes('admin') || !campaign) && (
            <>
              <Autocomplete
                multiple
                id='tags-filled'
                options={[]}
                freeSolo
                value={campaignForm.admins}
                onChange={(event, value) =>
                  setCampaignForm({
                    ...campaignForm,
                    admins: [...value],
                    writers: [...new Set([...campaignForm.writers, ...value])],
                    readers: [...new Set([...campaignForm.readers, ...value])],
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
                value={campaignForm.writers}
                onChange={(event, value) =>
                  setCampaignForm({
                    ...campaignForm,
                    writers: [...value],
                    readers: [...new Set([...campaignForm.readers, ...value])],
                  })
                }
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant='outlined'
                      label={option}
                      {...getTagProps({ index })}
                      disabled={campaignForm.admins.includes(option)}
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
                value={campaignForm.readers}
                onChange={(event, value) =>
                  setCampaignForm({ ...campaignForm, readers: [...value] })
                }
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant='outlined'
                      label={option}
                      {...getTagProps({ index })}
                      disabled={
                        campaignForm.admins.includes(option) ||
                        campaignForm.writers.includes(option)
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
                  value={campaignForm.public}
                  onChange={() =>
                    setCampaignForm({
                      ...campaignForm,
                      public: !campaignForm.public,
                    })
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
          {campaign ? (
            <>
              <Button
                variant='contained'
                sx={{ margin: 1 }}
                onClick={() => onUpdate()}
              >
                Update Campaign
              </Button>
            </>
          ) : (
            <Button
              variant='contained'
              sx={{ margin: 1 }}
              onClick={() => onCreate()}
            >
              Create Campaign
            </Button>
          )}
          <Button onClick={() => router.back()}>Cancel</Button>
        </FormControl>
      </Box>
    </>
  );
};

export default CampaignForm;