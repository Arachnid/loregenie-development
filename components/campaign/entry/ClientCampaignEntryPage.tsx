'use client';

import AlertDialog from '@/components/AlertDialog';
import { Entry } from '@/types';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  campaignEntry: Entry;
  worldID: string;
  campaignID: string;
  permissions: string[];
}

const ClientCampaignEntryPage = ({
  campaignEntry,
  worldID,
  campaignID,
  permissions,
}: Props) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    try {
      await fetch('/api/campaign/entry/delete', {
        method: 'POST',
        body: JSON.stringify({
          entryID: campaignEntry.id,
          worldID,
          campaignID,
          permissions,
        }),
      });
      router.push(`/world/${worldID}`);
      router.refresh();
    } catch (error) {
      console.log('error deleting campaign entry: ', error);
    }
  };

  return (
    <>
      <h1>name: {campaignEntry.name}</h1>
      <div>description: {campaignEntry.description}</div>
      <div>image: {campaignEntry.image}</div>
      {campaignEntry.parent && <div>parent: {campaignEntry.parent.name}</div>}
      <div>visibility: {campaignEntry.public ? 'public' : 'private'}</div>
      {permissions.includes('writer') && (
        <Button
          variant='contained'
          sx={{ margin: 1 }}
          onClick={() =>
            router.push(
              `/world/${worldID}/campaign/${campaignID}/entry/${campaignEntry.id}/edit`
            )
          }
        >
          Edit {campaignEntry.category}
        </Button>
      )}
      {permissions.includes('admin') && (
        <Button
          variant='contained'
          sx={{ margin: 1 }}
          color='error'
          onClick={() => setAlertOpen(true)}
        >
          Delete {campaignEntry.category}
        </Button>
      )}
      {alertOpen && (
        <AlertDialog
          title={`Delete ${campaignEntry.name}?`}
          alertOpen={alertOpen}
          setAlertOpen={setAlertOpen}
          action={onDelete}
        />
      )}
    </>
  );
};

export default ClientCampaignEntryPage;
