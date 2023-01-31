import GenerateFormPage from '@/components/GenerateFormPage';
import { getPermissions } from '@/lib/db';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Session, unstable_getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

type Props = {
  params: {
    worldID: string;
  };
};

const GenerateNewPage = async ({ params }: Props) => {
  const session: Session | null = await unstable_getServerSession(authOptions);
  if (!session?.user?.email) {
    notFound();
  }
  const permissions = await getPermissions(params.worldID, session.user.email);

  return <GenerateFormPage worldID={params.worldID} permissions={permissions} />;
};

export default GenerateNewPage;
