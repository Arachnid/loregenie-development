'use client';

import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import GenieForm from '@/components/GenieForm';
import { Campaign, Entry, LoreSchemas, World } from '@/types';
import { ClientContext } from '@/context/ClientContext';

type Props = {
  world: World;
  campaigns: Campaign[];
  entries: Entry[];
  permissions: string[];
};

const GenerateFormPage = ({
  world,
  campaigns,
  entries,
  permissions,
}: Props) => {
  const router = useRouter();
  const [form, setForm] = useState<Entry>({} as Entry);

  const onCreate = async () => {
    try {
      await fetch(
        form.campaign ? '/api/campaign/entry/create' : '/api/entry/create',
        {
          method: 'POST',
          body: JSON.stringify({
            entryData: {
              ...form,
              name: '',
              description: '',
              image: '',
              public: false,
            },
            worldID: world.id,
            permissions,
          }),
        }
      ).then((res) =>
        res.json().then((entry: Entry) => {
          router.push(
            form.campaign
              ? `/world/${world.id}/campaign/${entry.campaign?.id}/entry/${entry.id}`
              : `/world/${world.id}/entry/${entry.id}`
          );
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
