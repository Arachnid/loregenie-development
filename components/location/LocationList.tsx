'use client';

import { Location } from '@/types';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Props = {
  locations: Location[];
  worldID: string;
};

const LocationList = ({ locations, worldID }: Props) => {
  const router = useRouter();
  return (
    <>
      <h2>Locations</h2>
      <List disablePadding sx={{ pl: 1, maxWidth: 250 }}>
        {locations.map((location, index) => {
          return (
            <ListItem key={index}>
              <Link href={`world/${worldID}/location/${location.id}`}>
                {location.name}
              </Link>
            </ListItem>
          );
        })}
      </List>
      <Button onClick={() => router.push(`world/${worldID}/location/new`)}>
        Create Location
      </Button>
    </>
  );
};

export default LocationList;
