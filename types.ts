export interface WorldDB {
  readonly id: string;
  name: string;
  description: string;
  image: string;
  imagePrompt: string;
  readers: string[];
  writers: string[];
  admins: string[];
  public: boolean;
  prompt?: string;
  assistantId?: string;
  threadId?: string;
}

export interface World extends WorldDB {
  entries: Entry[];
  campaigns: Campaign[];
  contributors: User[];
}

export type CampaignDB = Omit<WorldDB, "prompt">;

export interface Campaign extends CampaignDB {
  entries: Entry[];
  contributors: User[];
}

export const isCampaign = (obj: any): obj is Campaign => {
  return obj.campaigns === undefined && obj.category === undefined;
};

export interface Entry {
  readonly id: string;
  name: string;
  description: string;
  prompt: string;
  image: string;
  imagePrompt: string;
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
  NPC = "NPC",
  Location = "Location",
  Lore = "Lore",
  Journal = "Journal",
}
export const isCategory = (value: string): value is Category => {
  return Object.values<string>(Category).includes(value);
};

export interface EntryHierarchy extends Entry {
  children?: EntryHierarchy[];
}

export type LoreSchemas = WorldDB | CampaignDB | Entry;

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

export enum PermissionLevel {
  reader = "reader",
  writer = "writer",
  admin = "admin",
}

export type WorldOrCampaignOrEntry =
  | {
      worldID: string;
      initialData: World;
    }
  | {
      worldID: string;
      campaignID: string;
      initialData: Campaign;
    }
  | {
      worldID: string;
      entryID: string;
      initialData: Entry;
    };
