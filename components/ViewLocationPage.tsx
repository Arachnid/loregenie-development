'use client';

import { Location } from '@/types';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

interface Props {
  location: Location;
  campaignID: string;
}

const ViewLocationPage = ({ location, campaignID }: Props) => {
  const router = useRouter();

  const onDelete = async () => {
    try {
      await fetch('/api/delete-location', {
        method: 'POST',
        body: JSON.stringify({
          locationID: location.id,
          campaignID,
        }),
      });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.log('error deleting location: ', error);
    }
  };

  return (
    <>
      <h1>name: {location.name}</h1>
      <div>description: {location.description}</div>
      <Button variant='contained' sx={{ margin: 1 }} onClick={() => onDelete()}>
        Delete Location
      </Button>
    </>
  );
};

export default ViewLocationPage;
