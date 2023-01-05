import { getLocation } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Location } from '@/types';
import LocationForm from '@/components/location/LocationForm';

interface Props {
  params: {
    settingID: string;
    locationID: string;
  };
}

export default async function LocationPage({ params }: Props) {
  const location: Location | undefined = await getLocation(
    params.settingID,
    params.locationID
  );
  if (!location) {
    notFound();
  }
  return <LocationForm location={location} settingID={params.settingID} />;
}
