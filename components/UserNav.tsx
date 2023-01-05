import { Session } from 'next-auth';
import { getSettings } from '@/lib/db';
import ClientUserNav from '@/components/ClientUserNav';
import { Setting } from '@/types';
import SettingsList from '@/components/setting/SettingsList';

interface Props {
  session: Session;
}

export default async function UserNav({ session }: Props) {
  const settings: Setting[] = await getSettings(session?.user?.email as string);
  return (
    <ClientUserNav>
      <SettingsList settings={settings} />
    </ClientUserNav>
  );
}
