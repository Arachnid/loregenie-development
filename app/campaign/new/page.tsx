import CampaignForm from '@/components/CampaignForm';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

export default async function NewCampaignPage() {
  const session = await unstable_getServerSession(authOptions);

  if (!session) {
    notFound();
  }
  
  return (
    <CampaignForm session={session} />
  );
}
