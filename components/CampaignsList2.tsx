'use client';

import Collapse from '@mui/material/Collapse';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import { Dispatch, SetStateAction, useState } from 'react';
import {
  ExtendedCampaign,
  Location,
  LocationMap,
  LocationNav,
} from '@/types';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import React from 'react';

interface Props {
  campaigns: ExtendedCampaign[];
  locations: LocationMap;
}

interface Open {
  [key: string]: boolean;
}

const expandHandler = (
  id: string,
  open: Open,
  setOpen: Dispatch<SetStateAction<Open>>
) => {
  const newOpen = Object.assign({}, open, { [id]: !open[id] });
  setOpen(newOpen);
};

function LocationsList({
  locationNav,
  locations,
}: {
  locationNav: LocationNav;
  locations: LocationMap;
}) {
  let results: Open = {};

  if (locationNav) {
    Object.values(locationNav).forEach((locationNav: LocationNav) => {
      results[locationNav.key] = false;
    });
  }

  const [open, setOpen] = useState<Open>(results);

  return (
    <List disablePadding sx={{ pl: 1 }}>
      {locationNav && Object.values(locationNav).map((locationNav, index) => {
        const location: Location = locations[locationNav.key];
        return (
          <div key={index}>
            <ListItem>
              <ListItemButton
                component={Link}
                href={`/location/${locationNav.key}`}
              >
                <ListItemText primary={location.name} />
              </ListItemButton>
              {locationNav.children && Object.values(locationNav.children).length > 0 ? (
                <a
                  onClick={() => expandHandler(locationNav.key, open, setOpen)}
                >
                  {open[locationNav.key] ? <ExpandLess /> : <ExpandMore />}
                </a>
              ) : (
                ''
              )}
            </ListItem>
            {locationNav.children && Object.values(locationNav.children).length > 0 ? (
              <Collapse in={open[locationNav.key]} timeout='auto' unmountOnExit>
                <LocationsList
                  locationNav={locationNav.children}
                  locations={locations}
                />
              </Collapse>
            ) : (
              ''
            )}
          </div>
        );
      })}
    </List>
  );
}

export default function CampaignsList2({ campaigns, locations }: Props) {
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
              {(Object.values(campaign.locationNav).length > 0) && <a onClick={() => expandHandler(campaign.id, open, setOpen)}>
                {open[campaign.id] ? <ExpandLess /> : <ExpandMore />}
              </a>}
            </ListItem>
            <Collapse in={open[campaign.id]} timeout='auto' unmountOnExit>
              <LocationsList
                locationNav={campaign.locationNav}
                locations={locations}
              />
            </Collapse>
          </div>
        );
      })}
    </List>
  );
}
