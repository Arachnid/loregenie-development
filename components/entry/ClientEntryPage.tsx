'use client';

import { Entry } from '@/types';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AlertDialog from '../AlertDialog';

interface Props {
  entry: Entry;
  worldID: string;
  permissions: string[];
}

const ClientEntryPage = ({ entry, worldID, permissions }: Props) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    try {
      await fetch('/api/entry/delete', {
        method: 'POST',
        body: JSON.stringify({ entryID: entry.id, worldID, permissions }),
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
      {permissions.includes('writer') && (
        <Button
          variant='contained'
          sx={{ margin: 1 }}
          onClick={() =>
            router.push(`/world/${worldID}/entry/${entry.id}/edit`)
          }
        >
          Edit {entry.category}
        </Button>
      )}
      {permissions.includes('admin') && (
        <Button
          variant='contained'
          sx={{ margin: 1 }}
          color='error'
          onClick={() => setAlertOpen(true)}
        >
          Delete {entry.category}
        </Button>
      )}
      {alertOpen && (
        <AlertDialog
          title={`Delete ${entry.name}?`}
          alertOpen={alertOpen}
          setAlertOpen={setAlertOpen}
          action={onDelete}
        />
      )}
    </>
  );
};

export default ClientEntryPage;
