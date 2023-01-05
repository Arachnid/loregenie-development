'use client';

import { Campaign } from '@/types';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Props = {
  campaigns: Campaign[];
  settingID: string;
};

const CampaignList = ({ campaigns, settingID }: Props) => {
  const router = useRouter();
  return (
    <>
      <h2>Campaigns</h2>
      <List>
        {campaigns.map((campaign, index) => {
          return (
            <ListItem key={index}>
              <Link href={`/setting/${settingID}/campaign/${campaign.id}`}>
                {campaign.name}
              </Link>
            </ListItem>
          );
        })}
      </List>
      <Button onClick={() => router.push(`setting/${settingID}/campaign/new`)}>
        Create Campaign
      </Button>
    </>
  );
};

export default CampaignList;
