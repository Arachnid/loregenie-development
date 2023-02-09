import GenerateFormPage from '@/components/GenerateFormPage';
import { getPermissions, getWorld } from '@/lib/db';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { World } from '@/types';
import { Session, unstable_getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

type Props = {
  params: {
    worldID: string;
  };
};

const GenerateNewPage = async ({ params }: Props) => {
  const session: Session | null = await unstable_getServerSession(authOptions);
  const { world }: { world: World | undefined } = await getWorld(
    params.worldID,
    session?.user?.email as string
  );

  if (!session?.user?.email || !world) {
    notFound();
  }

  const permissions = await getPermissions(params.worldID, session.user.email);

  return <GenerateFormPage world={world} permissions={permissions} />;
};

export default GenerateNewPage;
