import { getEntry, getPermissions } from '@/lib/db';
import { notFound } from 'next/navigation';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Session, unstable_getServerSession } from 'next-auth';
import ClientEntryPage from '@/components/entry/ClientEntryPage';

interface Props {
  params: {
    worldID: string;
    entryID: string;
  };
}

export default async function EntryPage({ params }: Props) {
  const entry = await getEntry(params.worldID, params.entryID);
  const session: Session | null = await unstable_getServerSession(authOptions);

  if (!entry || !session?.user?.email) {
    notFound();
  }
  const permissions = await getPermissions(params.worldID, session.user.email);

  return (
    <ClientEntryPage
      entry={entry}
      worldID={params.worldID}
      permissions={permissions}
    />
  );
}
