import NPCForm from '@/components/NPCForm';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

export default async function NewNPCPage() {
  const session = await unstable_getServerSession(authOptions);

  if (!session?.user?.email) {
    notFound();
  }
  return (
    <>
      <h1>Create New NPC</h1>
      <NPCForm npc={false} />
    </>
  );
}
