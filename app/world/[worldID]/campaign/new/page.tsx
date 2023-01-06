import CampaignForm from '@/components/campaign/CampaignForm';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    worldID: string;
  };
}

export default async function NewCampaignPage({ params }: Props) {
  const session = await unstable_getServerSession(authOptions);

  if (!session?.user?.email) {
    notFound();
  }

  return (
    <>
      <h1>Create New Campaign</h1>
      <CampaignForm
        sessionEmail={session?.user?.email}
        worldID={params.worldID}
      />
    </>
  );
}
