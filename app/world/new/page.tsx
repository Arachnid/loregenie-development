import WorldForm from '@/components/world/WorldForm';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

export default async function NewCampaignPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    notFound();
  }

  return (
    <>
      <h1>Create New World</h1>
      <WorldForm sessionEmail={session?.user?.email} />
    </>
  );
}
