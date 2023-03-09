'use client';

import { Campaign, CampaignDB, User, World } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import ImageSettings from '@/components/ImageSettings';
import PageBody from '@/components/PageBody';
import { Session } from 'next-auth';
import { useClientContext } from '@/hooks/useClientContext';
import { base64Converter } from '@/utils/base64Converter';

type Props = {
  world: World;
  campaign: Campaign;
  permissions: string[];
  session: Session;
  contributors: User[];
};

const campaignDBConverter = (campaign: Campaign) => {
  const { entries, contributors, ...campaignDB } = campaign;
  return campaignDB;
};

const ClientCampaignPage = ({
  world,
  campaign,
  permissions,
  session,
  contributors,
}: Props) => {
  const [campaignData, setCampaignData] = useState<CampaignDB>(
    campaignDBConverter(campaign)
  );
  const [mounted, setMounted] = useState(false);
  const { setClient } = useClientContext();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setClient({ world, campaign });
  }, [campaign]);

  const onDelete = async () => {
    try {
      await fetch('/api/campaign/delete', {
        method: 'POST',
        body: JSON.stringify({
          worldID: world.id,
          campaignID: campaign.id,
        }),
      });
      router.push(`/world/${world.id}`);
      router.refresh();
    } catch (error) {
      console.log('error deleting campaign: ', error);
    }
  };

  const onSave = async () => {
    try {
      await fetch('/api/campaign/update', {
        method: 'POST',
        body: JSON.stringify({
          campaignData,
          worldID: world.id,
        }),
      });
      router.refresh();
    } catch (error) {
      console.log('error updating campaign: ', error);
    }
  };

  const onImageUpload = async (uploadedFile: File) => {
    try {
      const base64: string = (await base64Converter(uploadedFile)) as string;
      const filePath = `worlds/${world.id}/campaigns/${campaign.id}/image`;
      await fetch('/api/image/create', {
        method: 'POST',
        body: JSON.stringify({ base64, filePath, worldID: world.id }),
      }).then((res) =>
        res.json().then((url: string) => {
          setCampaignData({ ...campaignData, image: url });
          router.refresh();
        })
      );
    } catch (error) {
      console.log('error submitting image: ', error);
    }
  };

  const onImageDelete = async () => {
    try {
      const filePath = `worlds/${world.id}/campaigns/${campaign.id}/image`;
      await fetch('/api/image/delete', {
        method: 'POST',
        body: JSON.stringify({
          filePath,
          worldID: world.id,
        }),
      }).then(() => {
        setCampaignData({ ...campaignData, image: '' });
        router.refresh();
      });
    } catch (error) {
      console.log('error deleting image: ', error);
    }
  };

  if (!mounted) {
    return <div className='w-full h-full bg-white' />;
  }

  return (
    <div className='flex flex-col w-full h-full mb-12'>
      <PageHeader<CampaignDB>
        data={campaignData}
        setData={setCampaignData}
        onSave={onSave}
        onDelete={onDelete}
        permissions={permissions}
        session={session}
        contributors={contributors}
      />
      <div className='flex flex-col items-start gap-6 p-4 overflow-y-scroll bg-white md:gap-10 md:px-16 md:py-6 grow isolate scrollbar-hide'>
        <div className='relative min-h-[352px] max-h-[352px] w-full rounded-2xl bg-lore-beige-400'>
          <div className='absolute flex bottom-4 right-4'>
            <ImageSettings<CampaignDB>
              data={campaignData}
              setData={setCampaignData}
              permissions={permissions}
              onUpload={onImageUpload}
              onDelete={onImageDelete}
            />
          </div>
          {campaignData.image && (
            <img
              className='object-cover w-full h-full rounded-lg'
              src={`${campaignData.image}?${Date.now()}`}
              alt=''
            />
          )}
        </div>
        <PageBody<CampaignDB>
          data={campaignData}
          setData={setCampaignData}
          permissions={permissions}
        />
      </div>
    </div>
  );
};

export default ClientCampaignPage;
