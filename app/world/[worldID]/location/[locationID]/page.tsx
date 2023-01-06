import { getLocation } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Location } from '@/types';
import ClientLocationPage from '@/components/location/ClientLocationPage';

interface Props {
  params: {
    locationID: string;
    worldID: string;
  };
}

export default async function LocationPage({ params }: Props) {
  const location: Location | undefined = await getLocation(params.worldID, params.locationID);
  if (!location) {
    notFound();
  }
  return <ClientLocationPage location={location} worldID={params.worldID} />;
}
