'use client';

import Collapse from '@mui/material/Collapse';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import { Dispatch, SetStateAction, useState } from 'react';
import { ExtendedCampaign, Location, LocationMap, Nav } from '@/types';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import React from 'react';

interface Props {
  campaigns: ExtendedCampaign[];
  locations: LocationMap;
}

interface Open {
  [key: string]: boolean,
}

const expandHandler = (id: string, open: Open, setOpen: Dispatch<SetStateAction<Open>>) => {
  const newOpen = Object.assign({}, open, { [id]: !open[id] });
  setOpen(newOpen);
};

function LocationsList({
  nav,
  locations,
}: {
  nav: Nav[];
  locations: LocationMap;
}) {
  const [open, setOpen] = useState<Open>(
    Object.fromEntries(nav.map((n: Nav) => [n.key, false]))
  );

  return (
    <List disablePadding sx={{ pl: 1 }}>
      {nav.map((n: Nav) => {
        const location: Location = locations[n.key];
        return (
          <>
            <ListItem>
              <ListItemButton component={Link} href={`/location/${n.key}`}>
                <ListItemText primary={location.name} />
              </ListItemButton>
              {n.children.length > 0 ? (
                <a onClick={() => expandHandler(n.key, open, setOpen)}>
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
  const [open, setOpen] = useState<Open>(
    Object.fromEntries(campaigns.map((campaign) => [campaign.id, false]))
  );

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
      {campaigns.map((campaign: ExtendedCampaign, index) => {
        return (
          <div key={index}>
            <ListItem>
              <ListItemButton
                component={Link}
                href={`/campaign/${campaign.id}`}
              >
                <ListItemText primary={campaign.name} />
              </ListItemButton>
              <a onClick={() => expandHandler(campaign.id, open, setOpen)}>
                {open[campaign.id] ? <ExpandLess /> : <ExpandMore />}
              </a>
            </ListItem>
            <Collapse in={open[campaign.id]} timeout='auto' unmountOnExit>
              <LocationsList nav={campaign.nav} locations={locations} />
            </Collapse>
          </div>
        );
      })}
    </List>
  );
}
