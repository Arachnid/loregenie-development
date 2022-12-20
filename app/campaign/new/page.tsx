'use client';

import { Button, TextField } from '@mui/material';
import { Box } from '@mui/system';
import {  useState } from 'react';

export default function NewCampaignPage() {
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    description: '',
  });

  const onSubmit = async () => {
    try {
      await fetch('/api/setCampaign', {
        method: 'POST',
        body: JSON.stringify(campaignForm),
      });
    } catch (error) {
      console.log('error submitting campaign: ', error);
    }
  };

  return (
    <div>
      <Box
        component='form'
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
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
        <Button variant='contained' sx={{ met: 3 }} onClick={onSubmit}>
          Submit Campaign
        </Button>
      </Box>
    </div>
  );
}
