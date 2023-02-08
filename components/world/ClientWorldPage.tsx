'use client';

import { World } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import ImageSettings from '@/components/ImageSettings';
import PageBody from '@/components/PageBody';
import { Session } from 'next-auth';

type Props = {
  world: World;
  permissions: string[];
  session: Session;
};

const WorldPage = ({ world, permissions, session }: Props) => {
  const [worldData, setWorldData] = useState<World>(world);

  const router = useRouter();

  const onDelete = async () => {
    try {
      await fetch('/api/world/delete', {
        method: 'POST',
        body: JSON.stringify({ worldID: world.id, permissions }),
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
          permissions,
        }),
      });
      router.refresh();
    } catch (error) {
      console.log('error updating world: ', error);
    }
  };

  return (
    <div className='flex flex-col w-full h-full mb-12'>
      <PageHeader<World>
        data={worldData}
        currentData={world}
        setData={setWorldData}
        onSave={onSave}
        permissions={permissions}
        session={session}
      />
      <div className='flex flex-col items-start gap-10 px-16 py-6 overflow-y-scroll bg-white grow isolate scrollbar-hide'>
        <div className='relative min-h-[352px] max-h-[352px] w-full rounded-2xl bg-lore-beige-400'>
          <div className='absolute flex bottom-4 right-4'>
            <ImageSettings<World>
              data={worldData}
              setData={setWorldData}
              permissions={permissions}
            />
          </div>
          {worldData.image && (
            <img
              className='object-cover w-full h-full rounded-lg'
              src={worldData.image}
              alt=''
            />
          )}
        </div>
        <PageBody<World>
          data={worldData}
          setData={setWorldData}
          permissions={permissions}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

export default WorldPage;
