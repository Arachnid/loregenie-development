import WorldForm from '@/components/world/WorldForm';
import { getPermissions, getWorld } from '@/lib/db';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { World } from '@/types';
import { Session, getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    worldID: string;
  };
}

const EditWorldPage = async ({ params }: Props) => {
  const session: Session | null = await getServerSession(authOptions);
  const { world }: { world: World | undefined } = await getWorld(
    params.worldID,
    session?.user?.email as string
  );

  if (!world || !session?.user?.email) {
    notFound();
  }
  const permissions = await getPermissions(params.worldID, session.user.email);

  return (
    <WorldForm
      sessionEmail={session.user.email}
      world={world}
      permissions={permissions}
    />
  );
};

export default EditWorldPage;
