'use client';

import { Campaign, User, World, WorldDB } from '@/types';
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
  campaigns: Campaign[];
  permissions: string[];
  session: Session;
  contributors: User[];
};

const worldDBConverter = (world: World) => {
  const { entries, campaigns, contributors, ...worldDB } = world;
  return worldDB;
};

const WorldPage = ({
  world,
  campaigns,
  permissions,
  session,
  contributors,
}: Props) => {
  const [worldData, setWorldData] = useState<WorldDB>(worldDBConverter(world));
  const [mounted, setMounted] = useState(false);
  const { setClient } = useClientContext();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setClient({ world });
  }, [world]);

  const blankCampaign = {
    name: '',
    description: '',
    image: '',
    readers: [session.user?.email],
    writers: [session.user?.email],
    admins: [session.user?.email],
    public: false,
    entries: [],
  };

  const onDelete = async () => {
    try {
      await fetch('/api/world/delete', {
        method: 'POST',
        body: JSON.stringify({ worldID: world.id }),
      });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.log('error deleting world: ', error);
    }
  };

  const onSave = async () => {
    try {
      await fetch('/api/world/update', {
        method: 'POST',
        body: JSON.stringify({
          worldData,
        }),
      });
      router.refresh();
    } catch (error) {
      console.log('error updating world: ', error);
    }
  };

  const onCreateCampaign = async () => {
    try {
      await fetch('/api/campaign/create', {
        method: 'POST',
        body: JSON.stringify({
          campaignData: blankCampaign,
          worldID: world.id,
          permissions,
        }),
      }).then((res) =>
        res.json().then((campaignID: string) => {
          router.push(`/world/${world.id}/campaign/${campaignID}`);
          router.refresh();
        })
      );
    } catch (error) {
      console.log('error submitting campaign: ', error);
    }
  };

  const onImageUpload = async (uploadedFile: File) => {
    try {
      const base64: string = await base64Converter(uploadedFile);
      const filePath = `worlds/${world.id}/image`;
      await fetch('/api/image/create', {
        method: 'POST',
        body: JSON.stringify({
          base64,
          filePath,
          worldID: world.id,
        }),
      }).then((res) =>
        res.json().then((url: string) => {
          setWorldData({ ...worldData, image: url });
          router.refresh();
        })
      );
    } catch (error) {
      console.log('error submitting image: ', error);
    }
  };

  const onImageDelete = async () => {
    try {
      const filePath = `worlds/${world.id}/image`;
      await fetch('/api/image/delete', {
        method: 'POST',
        body: JSON.stringify({
          filePath,
          worldID: world.id,
        }),
      }).then(() => {
        setWorldData({ ...worldData, image: '' });
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
      <PageHeader<WorldDB>
        data={worldData}
        setData={setWorldData}
        onSave={onSave}
        onDelete={onDelete}
        permissions={permissions}
        session={session}
        contributors={contributors}
      />
      <div className='flex flex-col items-start gap-6 p-4 overflow-y-scroll bg-white md:gap-10 md:px-16 md:py-6 grow isolate scrollbar-hide'>
        <div className='relative min-h-[352px] w-full rounded-2xl bg-lore-beige-400'>
          <div className='absolute flex bottom-4 right-4'>
            <ImageSettings<WorldDB>
              data={worldData}
              setData={setWorldData}
              permissions={permissions}
              onUpload={onImageUpload}
              onDelete={onImageDelete}
            />
          </div>
          {worldData.image && (
            <img
              className='object-cover w-full h-full rounded-lg'
              src={`${worldData.image}?${Date.now()}`}
              alt=''
            />
          )}
        </div>
        <PageBody<WorldDB>
          data={worldData}
          setData={setWorldData}
          permissions={permissions}
        />
        <div className='flex self-stretch p-[1px] bg-lore-beige-500' />
        <div className='flex flex-col w-full gap-4'>
          <div className='flex items-center self-stretch justify-between gap-4'>
            <p className='font-bold text-[40px]'>Campaigns</p>
            {permissions.includes('writer') && (
              <button
                className='flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg bg-lore-red-400 w-[100px] transition-all duration-300 ease-out hover:bg-lore-red-500'
                onClick={() => onCreateCampaign()}
              >
                <span className='text-[20px] material-icons'>add</span>
                <p className='font-medium leading-5'>New</p>
              </button>
            )}
          </div>
          <div className='flex flex-col gap-5'>
            {campaigns.map((campaign, index) => (
              <div
                className='flex items-end self-stretch justify-between h-40 gap-4 p-4 bg-cover cursor-pointer rounded-2xl'
                style={{
                  backgroundImage: `linear-gradient(180deg,rgba(0,0,0,0)0%,rgba(0,0,0,0.75)100%),url(${
                    campaign.image ? campaign.image : '/eryndor.svg'
                  })`,
                }}
                onClick={() =>
                  router.push(`/world/${world.id}/campaign/${campaign.id}`)
                }
                key={index}
              >
                <p className='flex items-end font-cinzel font-medium text-[40px] leading-[54px] self-stretch text-white'>
                  {campaign.name ? campaign.name.toUpperCase() : 'UNTITLED'}
                </p>
                <div className='flex flex-col-reverse flex-wrap-reverse items-end gap-2 max-h-28 min-w-max'>
                  {campaign.contributors.map((contributor, index) => (
                    <img
                      className='w-12 h-12 rounded-full min-w-max'
                      src={contributor.image}
                      alt=''
                      key={index}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className='flex w-full h-[72px]' />
        </div>
      </div>
    </div>
  );
};

export default WorldPage;
