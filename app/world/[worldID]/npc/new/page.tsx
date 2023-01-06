import NPCForm from '@/components/npc/NPCForm';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    worldID: string;
  };
}

export default async function NewNPCPage({ params }: Props) {
  const session = await unstable_getServerSession(authOptions);

  if (!session?.user?.email) {
    notFound();
  }
  return (
    <>
      <h1>Create New NPC</h1>
      <NPCForm worldID={params.worldID} />
    </>
  );
}
