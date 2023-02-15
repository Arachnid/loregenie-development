'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import GenieForm from '@/components/GenieForm';
import { Campaign, Entry, World } from '@/types';
import { useClientContext } from '@/hooks/useClientContext';
import ParentDropDown from '@/components/dropdown/ParentDropDown';
import CategoryDropDown from '@/components/dropdown/CategoryDropDown';

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

  const [defaultParent, setDefaultParent] = useState('');
  const [form, setForm] = useState<Entry>({
    name: 'Untitled',
    description: '',
    image: '',
    public: false,
  } as Entry);

  useEffect(() => {
    if (client.entry?.id) {
      return setDefaultParent(client.entry.name);
    }
    if (client.campaign?.id) {
      return setDefaultParent(client.campaign.name);
    }
    return setDefaultParent(client.world.name);
  }, [client]);

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

  const dropDownList = [
    ...entries,
    ...campaigns,
    ...campaigns?.map((campaign) => campaign.entries).flat(),
  ];

  if (!defaultParent) {
    return <></>;
  }

  return (
    <div className='flex flex-col items-center justify-center gap-10 px-16 py-6 overflow-y-scroll bg-white grow isolate scrollbar-hide'>
      <GenieForm onCreate={onCreate} disabled={!Boolean(form.category)}>
        <div className='relative z-20 flex self-stretch gap-4'>
          <ParentDropDown
            world={world}
            setData={setForm}
            data={form}
            permissions={permissions}
            generate={true}
            dropDownList={dropDownList}
            defaultParent={defaultParent}
          />
          <CategoryDropDown
            setData={setForm}
            data={form}
            permissions={permissions}
            generate={true}
          />
        </div>
      </GenieForm>
    </div>
  );
};

export default GenerateFormPage;
