'use client';

import { Autocomplete, Box, Button, Chip, TextField } from '@mui/material';
import { BaseCampaign } from '@/types'
import { Session } from 'next-auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CampaignForm = ({ session }: { session: Session }) => {
  const [campaignForm, setCampaignForm] = useState<BaseCampaign>({
    name: '',
    description: '',
    readers: [session?.user?.email ? session.user.email : ''],
    writers: [session?.user?.email ? session.user.email : ''],
    admins: [session?.user?.email ? session.user.email : ''],
  });

  const router = useRouter();

  const onSubmit = async () => {
    try {
      await fetch('/api/set-campaign', {
        method: 'POST',
        body: JSON.stringify(campaignForm),
      });
      router.refresh();
    } catch (error) {
      console.log('error submitting campaign: ', error);
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
        <Button variant='contained' sx={{ met: 3 }} onClick={() => onSubmit()}>
          Submit Campaign
        </Button>
      </Box>
    </>
  );
};

export default CampaignForm;
