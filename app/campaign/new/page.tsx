import CampaignForm from '@/components/CampaignForm';
// import { authOptions } from '@/pages/api/auth/[...nextauth]';
// import { unstable_getServerSession } from 'next-auth';

export default async function NewCampaignPage() {

  // const session = await unstable_getServerSession(authOptions);
  return (
    <CampaignForm />
  );
}
