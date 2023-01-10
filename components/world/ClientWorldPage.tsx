'use client';

import { World } from '@/types';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

type Props = {
  world: World;
};

const WorldPage = ({ world }: Props) => {
  const router = useRouter();
  const onDelete = async () => {
    try {
      await fetch('/api/world/delete', {
        method: 'POST',
        body: world.id,
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
      <Button
        variant='contained'
        color='error'
        sx={{ margin: '8px' }}
        onClick={() => onDelete()}
      >
        Delete World
      </Button>
      <Button
        sx={{ margin: '8px' }}
        onClick={() => router.push(`/world/${world.id}/edit`)}
      >
        Edit World
      </Button>
    </>
  );
};

export default WorldPage;
