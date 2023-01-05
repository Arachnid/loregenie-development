import {  getNPC } from '@/lib/db';
import { notFound } from 'next/navigation';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Session, unstable_getServerSession } from 'next-auth';
import ViewNPCPage from '@/components/ViewNPCPage';

interface Props {
  params: {
    npcID: string;
  };
}

export default async function NPCPage({ params }: Props) {
  const npc = await getNPC(params.npcID);
  const session: Session | null = await unstable_getServerSession(authOptions);

  if (!npc || !session?.user?.email) {
    notFound();
  }

  return (
    <div>
      <ViewNPCPage npc={npc} />
    </div>
  );
}
