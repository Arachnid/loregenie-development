import { getLocation } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Location } from '@/types';
import ViewLocationPage from '@/components/ViewLocationPage';

interface Props {
  params: {
    locationID: string;
    campaignID: string;
  };
}

export default async function LocationPage({ params }: Props) {
  const location: Location | undefined = await getLocation(params.locationID);
  if (!location) {
    notFound();
  }
  return <ViewLocationPage location={location} campaignID={params.campaignID} />;
}
