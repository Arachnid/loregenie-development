'use client';

import { ExtendedCampaign } from '@/types';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import React from 'react';
import CampaignForm from './CampaignForm';

type Props = {
  sessionEmail: string;
  campaign: ExtendedCampaign;
};

const ViewEditCampaignPage = ({ sessionEmail, campaign }: Props) => {
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

  return (
    <>
      <CampaignForm sessionEmail={sessionEmail} campaign={campaign} />
      <Button
        variant='contained'
        sx={{ margin: 1 }}
        onClick={() => router.back()}
      >
        Cancel
      </Button>
      <Button
        variant='contained'
        sx={{ margin: 1 }}
        color='error'
        onClick={() => onDelete()}
      >
        Delete Campaign
      </Button>
    </>
  );
};

export default ViewEditCampaignPage;
