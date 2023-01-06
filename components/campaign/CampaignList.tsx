'use client';

import { Campaign } from '@/types';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Props = {
  campaigns: Campaign[];
  worldID: string;
};

const CampaignList = ({ campaigns, worldID }: Props) => {
  const router = useRouter();
  return (
    <>
      <h2>Campaigns</h2>
      <List>
        {campaigns.map((campaign, index) => {
          return (
            <ListItem key={index}>
              <Link href={`/world/${worldID}/campaign/${campaign.id}`}>
                {campaign.name}
              </Link>
            </ListItem>
          );
        })}
      </List>
      <Button onClick={() => router.push(`world/${worldID}/campaign/new`)}>
        Create Campaign
      </Button>
    </>
  );
};

export default CampaignList;
