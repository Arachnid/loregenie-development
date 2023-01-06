'use client';

import { Location } from '@/types';
import { ExpandMore } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
  locations: Location[];
  worldID: string;
};

const LocationList = ({ locations, worldID }: Props) => {
  const router = useRouter();

  // Have an initial array of locations -- we will be deleting from this array as we go
  // for loop over this array until the array length is zero
  // Find the first location with an undefined parent
    // Create our top most ListItem -- and hold on to the location id -- LocationId1
      // Continue iterating through the list and find the next location that has a parent id of LocationId1 -- This is LocationId2 -- create a ListItem
        //  Continue iterating through the list and find the next location that has a parent id of LocationId2
  // Find the second location with an undefined parent
    // Create our top most ListItem -- and hold on to the location id -- LocationId4

  return (
    <>
      <h2>Locations</h2>
      {() => {
        for (let i = locations.length; i === 0; i--) {
          const topParent = locations.find(location => location.parent === undefined);
          if (topParent !== undefined) {
            const idToFind = topParent.id;
          }
        }
      }}
      {/* Make the maxWidth variable depending on content size */}
      <List disablePadding sx={{ pl: 1, maxWidth: 250 }}>
        <ListItem>
          <ListItemButton
            component={Link}
            href={`world/${worldID}/location/${'location.id'}`}
          >
            <ListItemText primary={'locationName'} />
          </ListItemButton>
          <ExpandMore />
        </ListItem>
      </List>
      <Button onClick={() => router.push(`world/${worldID}/location/new`)}>
        Create Location
      </Button>
    </>
  );
};

export default LocationList;
