'use client';

import { Location } from '@/types';
import Button from '@mui/material/Button';
import LocationForm from './LocationForm';

type Props = {
  location: Location;
  campaignID: string;
  firebaseKey: string;
};

const ViewEditLocationPage = ({
  location,
  campaignID,
  firebaseKey,
}: Props) => {
  const onDelete = async (
    locationID: string,
    campaignID: string,
    firebaseKey: string
  ) => {
    try {
      await fetch('/api/delete-location', {
        method: 'POST',
        body: JSON.stringify({ locationID, campaignID, firebaseKey }),
      });
    } catch (error) {
      console.log('error deleting campaign: ', error);
    }
  };
  return (
    <>
      <h1>Edit Location</h1>
      <LocationForm
        campaignID={campaignID}
        location={location}
        firebaseKey={firebaseKey}
      />
      <Button onClick={() => onDelete(location.id, campaignID, firebaseKey )}>Delete Location</Button>
    </>
  );
};

export default ViewEditLocationPage;
