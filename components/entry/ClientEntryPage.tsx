'use client';

import { Entry } from '@/types';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

interface Props {
  entry: Entry;
  worldID: string;
}

const ClientEntryPage = ({ entry, worldID }: Props) => {
  const router = useRouter();

  const onDelete = async () => {
    try {
      await fetch('/api/entry/delete', {
        method: 'POST',
        body: JSON.stringify({ entryID: entry.id, worldID }),
      });
      router.push(`/world/${worldID}`);
      router.refresh();
    } catch (error) {
      console.log('error deleting entry: ', error);
    }
  };

  return (
    <>
      <h1>name: {entry.name}</h1>
      <div>description: {entry.description}</div>
      <div>image: {entry.image}</div>
      {entry.parent && <div>parent: {entry.parent.name}</div>}
      <div>visibility: {entry.public ? 'public' : 'private'}</div>
      <Button
        variant='contained'
        sx={{ margin: 1 }}
        onClick={() =>
          router.push(`/world/${worldID}/entry/${entry.id}/edit`)
        }
      >
        Edit {entry.category}
      </Button>
      <Button
        variant='contained'
        sx={{ margin: 1 }}
        color='error'
        onClick={() => onDelete()}
      >
        Delete {entry.category}
      </Button>
    </>
  );
};

export default ClientEntryPage;
