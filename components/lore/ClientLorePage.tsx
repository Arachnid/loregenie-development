'use client';

import { Lore } from '@/types';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

interface Props {
  lore: Lore;
  worldID: string;
}

const ClientLorePage = ({ lore, worldID }: Props) => {
  const router = useRouter();

  const onDelete = async () => {
    try {
      await fetch('/api/lore/delete', {
        method: 'POST',
        body: JSON.stringify({
          loreID: lore.id,
          worldID,
        }),
      });
      router.push(`/world/${worldID}`);
      router.refresh();
    } catch (error) {
      console.log('error deleting lore: ', error);
    }
  };

  return (
    <>
      <h1>title: {lore.title}</h1>
      <div>description: {lore.description}</div>
      <div>visibility: {lore.public ? 'public' : 'private'}</div>
      <Button
        color='error'
        variant='contained'
        sx={{ margin: 1 }}
        onClick={() => onDelete()}
      >
        Delete Lore
      </Button>
      <Button
        variant='contained'
        onClick={() =>
          router.push(`/world/${worldID}/lore/${lore.id}/edit`)
        }
      >
        Edit Lore
      </Button>
      <Button onClick={() => router.push(`/world/${worldID}`)}>
        Return To World
      </Button>
    </>
  );
};

export default ClientLorePage;
