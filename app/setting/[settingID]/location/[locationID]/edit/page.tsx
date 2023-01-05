import { getLocation } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Location } from '@/types';
import ViewEditLocationPage from '@/components/ViewEditLocationPage';

interface Props {
  params: {
    locationID: string;
    campaignID: string;
  };
  searchParams: {
    nav: string;
  }
}

export default async function LocationPage({ params, searchParams }: Props) {
  const location: Location | undefined = await getLocation(params.locationID);
  if (!location) {
    notFound();
  }
  return <ViewEditLocationPage location={location} campaignID={params.campaignID} firebaseKey={searchParams.nav} />;
}
