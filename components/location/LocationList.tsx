'use client';

import { Location } from '@/types';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Props = {
  locations: Location[];
  settingID: string;
};

const LocationList = ({ locations, settingID }: Props) => {
  const router = useRouter();
  return (
    <>
      <h2>Locations</h2>
      <List>
        {locations.map((location, index) => {
          return (
            <ListItem key={index}>
              <Link href={`/setting/${settingID}/location/${location.id}`}>
                {location.name}
              </Link>
            </ListItem>
          );
        })}
      </List>
      <Button onClick={() => router.push(`setting/${settingID}/location/new`)}>
        Create Location
      </Button>
    </>
  );
};

export default LocationList;
