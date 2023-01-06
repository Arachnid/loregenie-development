'use client';

import { Location, LocationForm } from '@/types';
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
  worldID: string;
  location?: Location;
  parent?: string;
}

const createNewLocation = (parent: string | undefined): LocationForm => {
  return {
    name: '',
    description: '',
    public: false,
    plotPoint: 'Location' as const,
    parent,
  };
};

const LocationForm = ({ worldID, location, parent }: Props) => {
  const [locationForm, setLocationForm] = useState<Location | LocationForm>(
    location ? location : createNewLocation(parent)
  );

  const router = useRouter();

  const onCreate = async () => {
    try {
      await fetch('/api/location/create', {
        method: 'POST',
        body: JSON.stringify({ locationData: locationForm, worldID }),
      }).then((res) =>
        res.json().then((locationID: string) => {
          router.push(`/world/${worldID}/location/${locationID}`);
          router.refresh();
        })
      );
    } catch (error) {
      console.log('error creating location: ', error);
    }
  };

  const onUpdate = async () => {
    try {
      await fetch('/api/location/update', {
        method: 'POST',
        body: JSON.stringify({
          locationData: locationForm,
          locationID: location?.id,
          worldID,
        }),
      });
      router.push(`/world/${worldID}/location/${location?.id}`);
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
