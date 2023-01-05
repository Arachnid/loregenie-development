'use client';

import { Location } from '@/types';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

interface Props {
  location: Location;
  settingID: string;
}

const ClientLocationPage = ({ location, settingID }: Props) => {
  const router = useRouter();

  const onDelete = async () => {
    try {
      await fetch('/api/location/delete', {
        method: 'POST',
        body: JSON.stringify({
          locationID: location.id,
          settingID,
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
      <Button color='error' variant='contained' sx={{ margin: 1 }} onClick={() => onDelete()}>
        Delete Location
      </Button>
      <Button variant='contained' onClick={() => router.push(`/setting/${settingID}/location/${location.id}/edit`)}>Edit Location</Button>
      <Button onClick={() => router.push(`/setting/${settingID}`)}>Return To Setting</Button>
    </>
  );
};

export default ClientLocationPage;
