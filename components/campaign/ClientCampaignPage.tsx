'use client';

import { useClientContext } from '@/hooks/useClientContext';
import { Campaign, World } from '@/types';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AlertDialog from '../AlertDialog';

interface Props {
  campaign: Campaign;
  world: World;
  permissions: string[];
}

const ClientCampaignPage = ({ campaign, world, permissions }: Props) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const { client, setClient } = useClientContext();
  const router = useRouter();

  useEffect(() => {
    setClient({ world, campaign });
  }, [campaign]);

  const onDelete = async () => {
    try {
      await fetch('/api/campaign/delete', {
        method: 'POST',
        body: JSON.stringify({
          campaignID: campaign.id,
          worldID: world.id,
          permissions,
        }),
      });
      router.push(`/world/${world.id}`);
      router.refresh();
    } catch (error) {
      console.log('error deleting campaign: ', error);
    }
  };

  return (
    <>
      <h1>name: {campaign.name}</h1>
      <div>description: {campaign.description}</div>
      <div>readers: {campaign.readers.join(', ')}</div>
      <div>writers: {campaign.writers.join(', ')}</div>
      <div>admins: {campaign.admins.join(', ')}</div>
      <div>visibility: {campaign.public ? 'public' : 'private'}</div>
      {permissions.includes('writer') && (
        <Link href={`/world/${world.id}/campaign/${campaign.id}/entry/new`}>
          New Campaign Entry
        </Link>
      )}
      {permissions.includes('writer') && (
        <Button
          variant='contained'
          sx={{ margin: 1 }}
          onClick={() =>
            router.push(`/world/${world.id}/campaign/${campaign.id}/edit`)
          }
        >
          Edit Campaign
        </Button>
      )}
      {permissions.includes('admin') && (
        <Button
          variant='contained'
          sx={{ margin: 1 }}
          color='error'
          onClick={() => setAlertOpen(true)}
        >
          Delete Campaign
        </Button>
      )}
      {alertOpen && (
        <AlertDialog
          title={`Delete this Campaign?`}
          description={
            'Doing so will permanently delete the data in this campaign, including all nested entries.'
          }
          alertOpen={alertOpen}
          setAlertOpen={setAlertOpen}
          action={onDelete}
        />
      )}
    </>
  );
};

export default ClientCampaignPage;
