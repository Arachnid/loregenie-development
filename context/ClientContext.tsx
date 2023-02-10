'use client';

import { createContext, useMemo, useState } from 'react';

interface ClientContextI {
  id: string;
}

export const ClientContext = createContext({
  client: { id: '' },
  setClient: (client: ClientContextI) => {},
});

export const ClientProvider = (props: any) => {
  const [client, setClient] = useState({ id: '' });
  const value = useMemo(() => ({ client, setClient }), [client]);

  return <ClientContext.Provider value={value} {...props} />;
};
