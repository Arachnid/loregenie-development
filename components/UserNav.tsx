import { Session } from 'next-auth';
import { getWorlds } from '@/lib/db';
import ClientUserNav from '@/components/ClientUserNav';
import { World } from '@/types';
import WorldsList from '@/components/world/WorldList';

interface Props {
  session: Session;
}

export default async function UserNav({ session }: Props) {
  const worlds: World[] = await getWorlds(session?.user?.email as string);
  return (
    <ClientUserNav>
      <WorldsList worlds={worlds} />
    </ClientUserNav>
  );
}
