import { getLocation } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Location } from '@/types';
import ViewLocationPage from '@/components/ViewLocationPage';

interface Props {
  params: {
    id: string;
  };
}

export default async function LocationPage({ params }: Props) {
  const location: Location | undefined = await getLocation(params.id);
  if (!location) {
    notFound();
  }
  return <ViewLocationPage location={location} />;
}
