'use client';

import { ExtendedCampaign } from '@/types';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CampaignForm from './CampaignForm';

interface Props {
  campaign: ExtendedCampaign;
  sessionEmail: string;
}

const ViewCampaign = ({ campaign, sessionEmail }: Props) => {
  const [edit, setEdit] = useState<Boolean>(false);
  const router = useRouter();

  const onDelete = async () => {
    try {
      await fetch('/api/delete-campaign', {
        method: 'POST',
        body: campaign.id,
      });
      router.push('/');
    } catch (error) {
      console.log('error deleting campaign: ', error);
    }
  };

  if (edit) {
    return (
      <>
        <CampaignForm sessionEmail={sessionEmail} campaign={campaign} />
        <Button
          variant='contained'
          sx={{ margin: 1 }}
          onClick={() => setEdit(false)}
        >
          Cancel
        </Button>
        <Button
          variant='contained'
          sx={{ margin: 1 }}
          onClick={() => onDelete()}
        >
          Delete Campaign
        </Button>
      </>
    );
  }
  return (
    <>
      <h1>name: {campaign.name}</h1>
      <div>description: {campaign.description}</div>
      <div>readers: {campaign.readers.join(', ')}</div>
      <div>writers: {campaign.writers.join(', ')}</div>
      <div>admins: {campaign.admins.join(', ')}</div>
      <Button
        variant='contained'
        sx={{ margin: 1 }}
        onClick={() => setEdit(true)}
      >
        Edit Campaign
      </Button>
      <Button variant='contained' sx={{ margin: 1 }} onClick={() => onDelete()}>
        Delete Campaign
      </Button>
    </>
  );
};

export default ViewCampaign;
