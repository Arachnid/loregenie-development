'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import GenieForm from '@/components/GenieForm';
import { World } from '@/types';

type Props = {
  world: World;
  permissions: string[];
};

const blankPage = {
  name: '',
  description: '',
  image: '',
  category: '',
  public: false,
};

const GenerateFormPage = ({ world, permissions }: Props) => {
  const router = useRouter();

  const onCreate = async () => {
    try {
      await fetch('/api/entry/create', {
        method: 'POST',
        body: JSON.stringify({
          entryData: blankPage,
          worldID: world.id,
          permissions,
        }),
      }).then((res) =>
        res.json().then((entryID: string) => {
          router.push(`/world/${world.id}/entry/${entryID}`);
          router.refresh();
        })
      );
    } catch (error) {
      console.log('error submitting entry: ', error);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center gap-10 px-16 py-6 overflow-y-scroll bg-white grow isolate scrollbar-hide'>
      <GenieForm onCreate={onCreate} world={world} />
    </div>
  );
};

export default GenerateFormPage;
