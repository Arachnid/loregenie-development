'use client';
import { Box, Button, TextField } from '@mui/material';
import { Session } from 'next-auth';
import { useState } from 'react';

const CampaignForm = () => {
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    description: '',
  });

  const onSubmit = async () => {
    try {
      await fetch('/api/set-campaign', {
        method: 'POST',
        body: JSON.stringify(campaignForm),
      });
    } catch (error) {
      console.log('error submitting campaign: ', error);
    }
  };

  return (
    <>
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
        <Button variant='contained' sx={{ met: 3 }} onClick={() => onSubmit()}>
          Submit Campaign
        </Button>
      </Box>
    </>
  );
};

export default CampaignForm;
