'use client';

import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import React from 'react';
import { Campaign, Location } from '../lib/db';
import Collapse from '@mui/material/Collapse';
import Link from '@mui/material/Link';
import ListItem from '@mui/material/ListItem';
import { ListSubheader } from '@mui/material';

interface Props {
  campaigns: Campaign[];
  locations: { [key: string]: Location };
}

function LocationsList({
  nav,
  locations,
}: {
  nav: Campaign['nav'];
  locations: Props['locations'];
}) {
  const [open, setOpen] = React.useState(
    Object.fromEntries(nav.map((n) => [n.key, false]))
  );
  const handleLocationExpander = (id: string) => () => {
    const newOpen = Object.assign({}, open, { [id]: !open[id] });
    console.log(newOpen);
    setOpen(newOpen);
  };
  return (
    <List disablePadding sx={{ pl: 1 }}>
      {nav.map((n) => {
        const location = locations[n.key];
        return (
          <>
            <ListItem>
              <ListItemButton component={Link} href={`/location/${n.key}`}>
                <ListItemText primary={location.name} />
              </ListItemButton>
              {n.children.length > 0 ? (
                <a onClick={handleLocationExpander(n.key)}>
                  {open[n.key] ? <ExpandLess /> : <ExpandMore />}
                </a>
              ) : (
                ''
              )}
            </ListItem>
            {n.children.length > 0 ? (
              <Collapse in={open[n.key]} timeout='auto' unmountOnExit>
                <LocationsList nav={n.children} locations={locations} />
              </Collapse>
            ) : (
              ''
            )}
          </>
        );
      })}
    </List>
  );
}

export default function CampaignsList({ campaigns, locations }: Props) {
  const [open, setOpen] = React.useState(
    Object.fromEntries(campaigns.map((campaign) => [campaign.id, false]))
  );

  const handleCampaignExpander = (id: string) => () => {
    const newOpen = Object.assign({}, open, { [id]: !open[id] });
    console.log(newOpen);
    setOpen(newOpen);
  };

  return (
    <List
      disablePadding
      subheader={
        <ListSubheader>
          Campaigns
          <Link href='/campaign/new'>
            <AddIcon />
          </Link>
        </ListSubheader>
      }
    >
      {campaigns.map((campaign) => {
        return (
          <>
            <ListItem>
              <ListItemButton
                component={Link}
                href={`/campaign/${campaign.id}`}
              >
                <ListItemText primary={campaign.name} />
              </ListItemButton>
              <a onClick={handleCampaignExpander(campaign.id)}>
                {open[campaign.id] ? <ExpandLess /> : <ExpandMore />}
              </a>
            </ListItem>
            <Collapse in={open[campaign.id]} timeout='auto' unmountOnExit>
              <LocationsList nav={campaign.nav} locations={locations} />
            </Collapse>
          </>
        );
      })}
    </List>
  );
}
