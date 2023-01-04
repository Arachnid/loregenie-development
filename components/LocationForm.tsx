'use client';

import { BaseLocation, Location } from '@/types';
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
  campaignID: string;
  location?: Location;
  firebaseKey?: string;
}

const editExistingOrNewLocation = (
  campaignID: string,
  location: Location | undefined
) => {
  if (location) {
    return location;
  }
  return {
    campaign: campaignID,
    name: '',
    description: '',
    public: false,
  };
};

const LocationForm = ({ campaignID, location, firebaseKey }: Props) => {
  const [locationForm, setLocationForm] = useState<BaseLocation>(
    editExistingOrNewLocation(campaignID, location)
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

  const onUpdate = async () => {
    try {
      await fetch('/api/update-location', {
        method: 'POST',
        body: JSON.stringify({ data: locationForm, firebaseKey }),
      });
      router.push(`/campaign/${campaignID}`);
      router.refresh();
    } catch (error) {
      console.log('error updating location: ', error);
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
      <FormControl component='fieldset'>
        <RadioGroup
          value={locationForm.public}
          onChange={() =>
            setLocationForm({ ...locationForm, public: !locationForm.public })
          }
        >
          <FormControlLabel value={false} control={<Radio />} label='Private' />
          <FormControlLabel value={true} control={<Radio />} label='Public' />
        </RadioGroup>
      </FormControl>
      {location ? (
        <Button onClick={() => onUpdate()}>Update Location</Button>
      ) : (
        <Button onClick={() => onCreate()}>Create Location</Button>
      )}
      <Button onClick={() => router.back()}>Cancel</Button>
    </>
  );
};

export default LocationForm;
