'use client';

import { Location, LocationMap, Nav } from '@/types';
import Button from '@mui/material/Button';

interface Props {
  locations: LocationMap;
  campaignNav: Nav[];
}

const onDelete = async (id: string) => {
  try {
    await fetch('/api/delete-location', {
      method: 'POST',
      body: id,
    });
  } catch (error) {
    console.log('error deleting campaign: ', error);
  }
};

const recursiveLocations = (
  nav: Nav,
  locations: LocationMap,
  results: JSX.Element[]
) => {
  const location: Location = locations[nav.key];
  results.push(
    <div key={nav.key} style={{ display: 'flex', alignItems: 'baseline' }}>
      <div>{location.name}</div>
      <Button size='small' color='error' variant='contained' sx={{ margin: 1 }} onClick={() => onDelete(nav.key)}>
        Delete
      </Button>
    </div>
  );
  nav.children &&
    nav.children.forEach((child: Nav) =>
      recursiveLocations(child, locations, results)
    );
};

const LocationList = ({
  locations,
  nav,
}: {
  locations: LocationMap;
  nav: Nav[];
}): JSX.Element => {
  const results: JSX.Element[] = [];
  nav.forEach((child: Nav) => recursiveLocations(child, locations, results));
  return <>{results}</>;
};

const LocationsList = ({ locations, campaignNav }: Props) => {
  return (
    <>
      <h4>Locations:</h4>
      <LocationList locations={locations} nav={campaignNav} />
    </>
  );
};

export default LocationsList;

/*
locations [
  {
    key: region1
    children [
      {
        key: city1
        children [
          {
            key: tavern1
          }
        ]
      }
    ]
  }
]
*/
