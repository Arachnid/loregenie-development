import { getCampaign } from '@/lib/db';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    id: string;
  };
}

export default async function CampaignPage({ params }: Props) {
  const campaign = await getCampaign(params.id);
  if (!campaign) {
    notFound();
  }
  return (
    <div>
      <h1>name: {campaign.name}</h1>
      <div>description: {campaign.description}</div>
      <div>readers: {campaign.readers.join(', ')}</div>
      <div>writers: {campaign.writers.join(', ')}</div>
      <div>admins: {campaign.admins.join(', ')}</div>
    </div>
  );
}
