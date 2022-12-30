'use client';

import { BaseLocation } from '@/types';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Dispatch, SetStateAction, useState } from 'react';

interface Props {
  campaignID: string;
}

interface LocationFormProps {
  campaignID: string;
  locationForm: BaseLocation;
  setLocationForm: Dispatch<SetStateAction<BaseLocation>>;
}

const editExistingOrNewLocation = (campaignID: string) => {
  return {
    campaign: campaignID,
    name: '',
    description: '',
    public: false,
  };
};

const LocationForm = ({
  campaignID,
  locationForm,
  setLocationForm,
}: LocationFormProps) => {
  const [newLocation, setNewLocation] = useState<JSX.Element[]>([]);

  const addLocation = () => {
    setNewLocation((prev) => [
      ...prev,
      <LocationForm
        campaignID={campaignID}
        locationForm={locationForm}
        setLocationForm={setLocationForm}
      />,
    ]);
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
        <Button onClick={() => addLocation()}>Add Location</Button>
        <Button>Remove Location</Button>
      </Box>
      <Box sx={{ margin: 5 }}>{newLocation}</Box>
    </>
  );
};

const LocationFormPage = ({ campaignID }: Props) => {
  const [locationForm, setLocationForm] = useState<BaseLocation>(
    editExistingOrNewLocation(campaignID)
  );

  const onCreate = async () => {
    try {
      await fetch('/api/create-location', {
        method: 'POST',
        body: JSON.stringify(locationForm),
      });
    } catch (error) {
      console.log('error creating location: ', error);
    }
  };

  return (
    <>
      <LocationForm
        campaignID={campaignID}
        locationForm={locationForm}
        setLocationForm={setLocationForm}
      />
      <Button onClick={() => onCreate()}>Create Location</Button>
    </>
  );
};

export default LocationFormPage;
