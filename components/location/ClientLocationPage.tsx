'use client';

import { Location } from '@/types';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Props {
  location: Location;
  worldID: string;
}

const ClientLocationPage = ({ location, worldID }: Props) => {
  const router = useRouter();

  const onDelete = async () => {
    try {
      await fetch('/api/location/delete', {
        method: 'POST',
        body: JSON.stringify({
          locationID: location.id,
          worldID,
        }),
      });
      router.push(`/world/${worldID}`);
      router.refresh();
    } catch (error) {
      console.log('error deleting location: ', error);
    }
  };

  return (
    <>
      <h1>name: {location.name}</h1>
      <div>description: {location.description}</div>
      <div>visibility: {location.public ? 'public' : 'private'}</div>
      <Button
        color='error'
        variant='contained'
        sx={{ margin: 1 }}
        onClick={() => onDelete()}
      >
        Delete Location
      </Button>
      <Button
        variant='contained'
        onClick={() =>
          router.push(`/world/${worldID}/location/${location.id}/edit`)
        }
      >
        Edit Location
      </Button>
      <Button onClick={() => router.push(`/world/${worldID}`)}>
        Return To World
      </Button>
      <br />
      <Link
        href={{
          pathname: `/world/${worldID}/location/new`,
          query: {parent: location.id},
        }}
      >
        Add Sub Location
      </Link>
    </>
  );
};

export default ClientLocationPage;
