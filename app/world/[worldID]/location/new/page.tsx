import LocationForm from '@/components/location/LocationForm';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    worldID: string;
  };
  searchParams: {
    parent: string;
  }
}

export default async function NewLocationPage({ params, searchParams }: Props) {
  const session = await unstable_getServerSession(authOptions);

  if (!session?.user?.email) {
    notFound();
  }

  return (
    <>
      <h1>Create New Location</h1>
      <LocationForm worldID={params.worldID} parent={searchParams.parent} />
    </>
  );
}
