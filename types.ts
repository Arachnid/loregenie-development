export interface World {
  readonly id: string;
  name: string;
  description: string;
  readers: string[];
  writers: string[];
  admins: string[];
  public: boolean;
  entries: Entry[];
  campaigns: Campaign[];
}
export type WorldForm = Omit<World, 'id'>;

export type Campaign = Omit<World, 'campaigns'>;
export type CampaignForm = Omit<Campaign, 'id'>;

export interface Entry {
  readonly id: string;
  name: string;
  description: string;
  image: string;
  public: boolean;
  parent?: {
    id: string;
    name: string;
  };
  category: Category;
}
export type EntryForm = Omit<Entry, 'id'>;

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
