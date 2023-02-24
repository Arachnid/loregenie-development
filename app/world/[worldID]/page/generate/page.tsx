import GenerateFormPage from '@/components/pages/GenerateFormPage';
import { getPermissions, getWorld } from '@/lib/db';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Campaign, Entry, World } from '@/types';
import { Session, getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

type Props = {
  params: {
    worldID: string;
  };
};

const GenerateNewPage = async ({ params }: Props) => {
  const session: Session | null = await getServerSession(authOptions);
  const {
    world,
    entries,
    campaigns,
  }: { world: World | undefined; entries: Entry[]; campaigns: Campaign[] } =
    await getWorld(params.worldID, session?.user?.email as string);

  if (!session?.user?.email || !world) {
    notFound();
  }

  const permissions = await getPermissions(params.worldID, session.user.email);

  return (
    <GenerateFormPage
      world={world}
      entries={entries}
      campaigns={campaigns}
      permissions={permissions}
    />
  );
};

export default GenerateNewPage;
