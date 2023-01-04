'use client';

import { BaseLocation } from '@/types';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  campaignID: string;
}

const editExistingOrNewLocation = (campaignID: string) => {
  return {
    campaign: campaignID,
    name: '',
    description: '',
    public: false,
  };
};

const LocationFormPage = ({ campaignID }: Props) => {
  const [locationForm, setLocationForm] = useState<BaseLocation>(
    editExistingOrNewLocation(campaignID)
  );

  const router = useRouter();

  const onCreate = async () => {
    try {
      await fetch('/api/create-location', {
        method: 'POST',
        body: JSON.stringify(locationForm),
      });
      router.push(`/campaign/${campaignID}`);
      router.refresh();
    } catch (error) {
      console.log('error creating location: ', error);
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
          value={locationForm.name}
          onChange={(e) =>
            setLocationForm({ ...locationForm, name: e.target.value })
          }
        />
        <TextField
          label='description'
          margin='normal'
          value={locationForm.description}
          onChange={(e) =>
            setLocationForm({ ...locationForm, description: e.target.value })
          }
        />
      </Box>
      <Button onClick={() => onCreate()}>Create Location</Button>
      <Button onClick={() => router.back()}>Cancel</Button>
    </>
  );
};

export default LocationFormPage;
