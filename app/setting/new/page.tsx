import SettingForm from '@/components/setting/SettingForm';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

export default async function NewCampaignPage() {
  const session = await unstable_getServerSession(authOptions);

  if (!session?.user?.email) {
    notFound();
  }

  return (
    <>
      <h1>Create New Setting</h1>
      <SettingForm sessionEmail={session?.user?.email} setting={false} />
    </>
  );
}
