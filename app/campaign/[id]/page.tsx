import ViewCampaign from '@/components/ViewCampaign';
import ViewLocations from '@/components/ViewLocations';
import { getCampaign, getLocations } from '@/lib/db';
import { notFound } from 'next/navigation';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Session, unstable_getServerSession } from 'next-auth';
import { ExtendedCampaign, LocationMap } from '@/types';

interface Props {
  params: {
    id: string;
  };
}

export default async function CampaignPage({ params }: Props) {
  const campaign: ExtendedCampaign | undefined = await getCampaign(params.id);
  const session: Session | null = await unstable_getServerSession(authOptions);

  if (!campaign || !session?.user?.email) {
    notFound();
  }
  
  const locations: LocationMap | undefined = await getLocations(campaign.id);

  return (
    <div>
      <ViewCampaign campaign={campaign} sessionEmail={session.user.email} />
      {locations && <ViewLocations locations={locations} campaignNav={campaign.nav} />}
    </div>
  );
}
