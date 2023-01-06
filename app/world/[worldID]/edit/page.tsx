import WorldForm from '@/components/world/WorldForm';
import { getWorld } from '@/lib/db';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { World } from '@/types';
import { Session, unstable_getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    worldID: string;
  };
}

const EditWorldPage = async ({ params }: Props) => {
  const {world}: {world: World | undefined} = await getWorld(params.worldID);
  const session: Session | null = await unstable_getServerSession(authOptions);

  if (!world || !session?.user?.email) {
    notFound();
  }

  return <WorldForm sessionEmail={session.user.email} world={world} />
}

export default EditWorldPage;