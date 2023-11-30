"use client";

import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { Campaign, ClientContextI, Entry, World } from "@/types";
import { createContext, useMemo } from "react";

export const ClientContext = createContext({
  client: { world: {} as World, campaign: {} as Campaign, entry: {} as Entry },
  setClient: (client: ClientContextI) => {},
});

export const ClientProvider = (props: any) => {
  const [client, setClient] = useLocalStorageState("client-context", {
    world: {} as World,
    campaign: {} as Campaign,
    entry: {} as Entry,
  });

  const value = useMemo(() => ({ client, setClient }), [client]);

  return <ClientContext.Provider value={value} {...props} />;
};
