import SettingForm from '@/components/setting/SettingForm';
import { getSetting } from '@/lib/db';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Setting } from '@/types';
import { Session, unstable_getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    settingID: string;
  };
}

const EditSettingPage = async ({ params }: Props) => {
  const {setting}: {setting: Setting | undefined} = await getSetting(params.settingID);
  const session: Session | null = await unstable_getServerSession(authOptions);

  if (!setting || !session?.user?.email) {
    notFound();
  }

  return <SettingForm sessionEmail={session.user.email} setting={setting} />
}

export default EditSettingPage;