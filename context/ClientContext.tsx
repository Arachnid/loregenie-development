'use client';

import { Campaign, ClientContextI, Entry, World } from '@/types';
import { createContext, useMemo, useState } from 'react';

export const ClientContext = createContext({
  client: { world: {} as World, campaign: {} as Campaign, entry: {} as Entry },
  setClient: (client: ClientContextI) => {},
});

export const ClientProvider = (props: any) => {
  const [client, setClient] = useState({
    world: {},
    campaign: {},
    entry: {},
  });
  const value = useMemo(() => ({ client, setClient }), [client]);

  return <ClientContext.Provider value={value} {...props} />;
};
