'use client';

import { World } from '@/types';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

type Props = {
  world: World;
  permissions: string[];
};

const WorldPage = ({ world, permissions }: Props) => {
  const router = useRouter();
  const onDelete = async () => {
    try {
      await fetch('/api/world/delete', {
        method: 'POST',
        body: JSON.stringify({ worldID: world.id, permissions }),
      });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.log('error deleting world: ', error);
    }
  };
  return (
    <>
      <h1>{world.name}</h1>
      <div>{world.description}</div>
      <div>admins: {world.admins.join(', ')}</div>
      <div>writers: {world.writers.join(', ')}</div>
      <div>readers: {world.readers.join(', ')}</div>
      <div>visibility: {world.public ? 'public' : 'private'}</div>
      {permissions.includes('writer') && (
        <Button
          variant='contained'
          sx={{ margin: '8px' }}
          onClick={() => router.push(`/world/${world.id}/edit`)}
        >
          Edit World
        </Button>
      )}
      {permissions.includes('admin') && (
        <Button
          variant='contained'
          color='error'
          sx={{ margin: '8px' }}
          onClick={() => onDelete()}
        >
          Delete World
        </Button>
      )}
    </>
  );
};

export default WorldPage;
