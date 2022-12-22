'use client';

import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import { BaseCampaign, ExtendedCampaign } from '@/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

interface Props {
  sessionEmail: string;
  campaign: ExtendedCampaign | false;
}

const editExistingOrNewCampaign = (
  campaign: ExtendedCampaign | false,
  sessionEmail: string
) => {
  if (campaign) {
    return {
      name: campaign.name,
      description: campaign.description,
      readers: campaign.readers,
      writers: campaign.writers,
      admins: campaign.admins,
      public: campaign.public,
    };
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

const CampaignForm = ({ sessionEmail, campaign }: Props) => {
  const [campaignForm, setCampaignForm] = useState<BaseCampaign>(
    editExistingOrNewCampaign(campaign, sessionEmail)
  );

  const router = useRouter();

  const onCreate = async () => {
    try {
      await fetch('/api/create-campaign', {
        method: 'POST',
        body: JSON.stringify(campaignForm),
      });
      router.refresh();
    } catch (error) {
      console.log('error submitting campaign: ', error);
    }
  };

  const onUpdate = async () => {
    if (campaign) {
      try {
        await fetch('/api/update-campaign', {
          method: 'POST',
          body: JSON.stringify({
            campaignData: campaignForm,
            campaignID: campaign.id,
          }),
        });
        router.push(`/campaign/${campaign.id}`);
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
        }}
      >
        <TextField
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
          maxRows={4}
          value={campaignForm.description}
          onChange={(e) =>
            setCampaignForm({ ...campaignForm, description: e.target.value })
          }
        />
        <Autocomplete
          multiple
          id='tags-filled'
          options={[]}
          freeSolo
          value={campaignForm.readers}
          onChange={(event, value) =>
            setCampaignForm({ ...campaignForm, readers: value })
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
          value={campaignForm.writers}
          onChange={(event, value) =>
            setCampaignForm({ ...campaignForm, writers: value })
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
          value={campaignForm.admins}
          onChange={(event, value) =>
            setCampaignForm({ ...campaignForm, admins: value })
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
            value={campaignForm.public}
            onChange={() =>
              setCampaignForm({ ...campaignForm, public: !campaignForm.public })
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
        {campaign ? (
          <Button
            variant='contained'
            sx={{ margin: 1 }}
            onClick={() => onUpdate()}
          >
            Update Campaign
          </Button>
        ) : (
          <Button
            variant='contained'
            sx={{ margin: 1 }}
            onClick={() => onCreate()}
          >
            Create Campaign
          </Button>
        )}
      </Box>
    </>
  );
};

export default CampaignForm;
