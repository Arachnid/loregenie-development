'use client';

import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
import GenieForm from '@/components/GenieForm';
import { Campaign, Entry, LoreSchemas, World } from '@/types';
import { ClientContext } from '@/context/ClientContext';

type Props = {
  world: World;
  campaigns: Campaign[];
  entries: Entry[];
  permissions: string[];
};

const apiRoutes = {
  world: '/api/world/create',
  campaign: '/api/campaign/create',
  entry: '/api/entry/create',
  campaignEntry: '/api/campaign/entry/create',
};

const GenerateFormPage = ({
  world,
  campaigns,
  entries,
  permissions,
}: Props) => {
  const router = useRouter();
  const { client, setClient } = useContext(ClientContext);
  const [form, setForm] = useState<LoreSchemas>();
  console.log(client);

  const onCreate = async () => {
    try {
      await fetch('/api/entry/create', {
        method: 'POST',
        body: JSON.stringify({
          entryData: {
            name: '',
            description: '',
            image: '',
            category: '',
            public: false,
          },
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
      <GenieForm
        onCreate={onCreate}
        world={world}
        form={form}
        setForm={setForm}
        entries={entries}
        campaigns={campaigns}
      />
    </div>
  );
};

export default GenerateFormPage;
