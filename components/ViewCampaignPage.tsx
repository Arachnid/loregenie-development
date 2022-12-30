'use client';

import { ExtendedCampaign, LocationMap } from '@/types';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import LocationsList from '@/components/LocationsList';
import Link from 'next/link';

interface Props {
  campaign: ExtendedCampaign;
  locations: LocationMap | undefined;
}

const ViewCampaignPage = ({ campaign, locations }: Props) => {
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
      <h1>name: {campaign.name}</h1>
      <div>description: {campaign.description}</div>
      <div>readers: {campaign.readers.join(', ')}</div>
      <div>writers: {campaign.writers.join(', ')}</div>
      <div>admins: {campaign.admins.join(', ')}</div>
      <div>visibility: {campaign.public ? 'public' : 'private'}</div>
      <Link href={`/campaign/${campaign.id}/edit`} style={{ textDecoration: 'none' }}>
        <Button variant='contained' sx={{ margin: 1 }}>
          Edit Campaign
        </Button>
      </Link>
      <Button variant='contained' sx={{ margin: 1 }} color='error' onClick={() => onDelete()}>
        Delete Campaign
      </Button>
      {locations && (
        <LocationsList locations={locations} locationNav={campaign.locationNav} campaignID={campaign.id} />
      )}
      <Link href={`/campaign/${campaign.id}/location/new`} style={{ textDecoration: 'none' }}>
        <Button variant='contained' sx={{ margin: 1 }}>
          Add Location
        </Button>
      </Link>
    </>
  );
};

export default ViewCampaignPage;
