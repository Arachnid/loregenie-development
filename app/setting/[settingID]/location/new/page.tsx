import LocationForm from '@/components/location/LocationForm';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    settingID: string;
  };
}

export default async function NewLocationPage({ params }: Props) {
  const session = await unstable_getServerSession(authOptions);

  if (!session?.user?.email) {
    notFound();
  }

  return (
    <>
      <h1>Create New Location</h1>
      <LocationForm settingID={params.settingID} />
    </>
  );
}
