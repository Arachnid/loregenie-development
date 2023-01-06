import {  getNPC } from '@/lib/db';
import { notFound } from 'next/navigation';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Session, unstable_getServerSession } from 'next-auth';
import ClientNPCPage from '@/components/npc/ClientNPCPage';

interface Props {
  params: {
    worldID: string;
    npcID: string;
  };
}

export default async function NPCPage({ params }: Props) {
  const npc = await getNPC(params.worldID, params.npcID);
  const session: Session | null = await unstable_getServerSession(authOptions);

  if (!npc || !session?.user?.email) {
    notFound();
  }

  return (
    <div>
      <ClientNPCPage npc={npc} worldID={params.worldID} />
    </div>
  );
}
