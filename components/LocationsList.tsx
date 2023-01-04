'use client';

import { Location, LocationMap, LocationNav } from '@/types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

interface Props {
  locations: LocationMap;
  locationNav: LocationNav;
  campaignID: string;
}

const onDelete = async (
  locationID: string,
  campaignID: string,
  firebaseKey: string
) => {
  try {
    await fetch('/api/delete-location', {
      method: 'POST',
      body: JSON.stringify({ locationID, campaignID, firebaseKey }),
    });
  } catch (error) {
    console.log('error deleting campaign: ', error);
  }
};

const recursiveLocations = (
  nav: LocationNav,
  locations: LocationMap,
  campaignID: string,
  results: JSX.Element[],
  firebaseKey?: string
) => {
  const router = useRouter();
  const location: Location = locations[nav.key];
  let nestedFirebaseKey: string;
  if (firebaseKey) {
    nestedFirebaseKey = `${firebaseKey}.children.${nav.key}`;
  } else {
    nestedFirebaseKey = `${nav.key}`;
  }

  results.push(
    <Box key={nav.key} style={{ display: 'flex', alignItems: 'baseline' }}>
      <div>{location.name}</div>
      <Button
        size='small'
        color='error'
        variant='contained'
        sx={{ margin: 1 }}
        onClick={() =>
          onDelete(nav.key, campaignID, nestedFirebaseKey).then(() =>
            router.refresh()
          )
        }
      >
        Delete
      </Button>
    </Box>
  );
  nav.children &&
    Object.values(nav.children).forEach((value: LocationNav) =>
      recursiveLocations(
        value,
        locations,
        campaignID,
        results,
        nestedFirebaseKey
      )
    );
};

const LocationList = ({
  locations,
  locationNav,
  campaignID,
}: Props): JSX.Element => {
  if (!Object.keys(locations).length) {
    return <></>;
  }
  const results: JSX.Element[] = [];
  Object.values(locationNav).forEach((value: LocationNav) =>
    recursiveLocations(value, locations, campaignID, results)
  );

  return <>{results}</>;
};

const LocationsList = ({ locations, locationNav, campaignID }: Props) => {
  return (
    <>
      <h4>Locations:</h4>
      <LocationList
        locations={locations}
        locationNav={locationNav}
        campaignID={campaignID}
      />
    </>
  );
};

export default LocationsList;
