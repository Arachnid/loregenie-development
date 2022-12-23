'use client';

import { Location } from '@/types';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

interface Props {
  location: Location;
}

const ViewLocationPage = ({ location }: Props) => {
  const router = useRouter();

  const onDelete = async () => {
    try {
      await fetch('/api/delete-location', {
        method: 'POST',
        body: location.id,
      });
      router.push('/');
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
