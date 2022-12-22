'use client';

import { Location, LocationMap, Nav } from '@/types';

interface Props {
  locations: LocationMap;
  campaignNav: Nav[];
}

const recursiveLocations = (
  nav: Nav,
  locations: LocationMap,
  results: JSX.Element[]
) => {
  const location: Location = locations[nav.key];
  results.push(
    <div key={nav.key}>
      <div>{location.name}</div>
      <div>{location.description}</div>
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

const ViewLocations = ({ locations, campaignNav }: Props) => {
  return <LocationList locations={locations} nav={campaignNav} />;
};

export default ViewLocations;
