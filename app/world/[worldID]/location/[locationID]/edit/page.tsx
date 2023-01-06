import { getLocation } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Location } from '@/types';
import LocationForm from '@/components/location/LocationForm';

interface Props {
  params: {
    worldID: string;
    locationID: string;
  };
}

export default async function EditLocationPage({ params }: Props) {
  const location: Location | undefined = await getLocation(
    params.worldID,
    params.locationID
  );
  if (!location) {
    notFound();
  }
  return <LocationForm location={location} worldID={params.worldID} />;
}
