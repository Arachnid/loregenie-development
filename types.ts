export interface World {
  readonly id: string;
  name: string;
  description: string;
  image: string;
  readers: string[];
  writers: string[];
  admins: string[];
  public: boolean;
  entries: Entry[];
  campaigns: Campaign[];
  contributors: User[];
}

export type Campaign = Omit<World, 'campaigns'>;
export const isCampaign = (obj: any): obj is Campaign => {
  return obj.campaigns === undefined && obj.category === undefined;
};

export interface Entry {
  readonly id: string;
  name: string;
  description: string;
  image: string;
  public: boolean;
  category?: Category;
  parent?: {
    id: string;
    name: string;
  };
  campaign?: {
    id: string;
    name: string;
  };
}
export const isEntry = (obj: any): obj is Entry => {
  return obj.category !== undefined;
};

export enum Category {
  NPC = 'NPC',
  Location = 'Location',
  Lore = 'Lore',
  Journal = 'Journal',
}
export const isCategory = (value: string): value is Category => {
  return Object.values<string>(Category).includes(value);
};

export interface EntryHierarchy extends Entry {
  children?: EntryHierarchy[];
}

export type LoreSchemas = World | Campaign | Entry;

export interface ClientContextI {
  world: World;
  campaign?: Campaign;
  entry?: Entry;
}

export interface User {
  image: string;
  email: string;
  username: string;
}
