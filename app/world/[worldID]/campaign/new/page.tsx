import CampaignForm from '@/components/campaign/CampaignForm';
import { getPermissions } from '@/lib/db';
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

  const permissions = await getPermissions(params.worldID, session.user.email);

  return (
    <>
      <h1>Create New Campaign</h1>
      <CampaignForm
        sessionEmail={session?.user?.email}
        worldID={params.worldID}
        permissions={permissions}
      />
    </>
  );
}
