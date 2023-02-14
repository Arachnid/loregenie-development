'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import GenieForm from '@/components/GenieForm';
import { Campaign, Entry, World } from '@/types';
import { useClientContext } from '@/hooks/useClientContext';

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
  const { client } = useClientContext();

  const [form, setForm] = useState<Entry>({
    name: 'Untitled',
    description: '',
    image: '',
    public: false,
  } as Entry);

  useEffect(() => {
    if (client.entry?.parent) {
      setForm({ ...form, parent: client.entry.parent });
    }
    if (client.campaign?.id) {
      setForm({
        ...form,
        campaign: { id: client.campaign.id, name: client.campaign.name },
      });
    }
  }, [client]);

  const onCreate = async () => {
    try {
      await fetch(
        form.campaign ? '/api/campaign/entry/create' : '/api/entry/create',
        {
          method: 'POST',
          body: JSON.stringify({
            entryData: form,
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
