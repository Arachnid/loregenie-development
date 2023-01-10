export interface World {
  readonly id: string;
  name: string;
  description: string;
  readers: string[];
  writers: string[];
  admins: string[];
  public: boolean;
  entries: Entry[];
}
export type WorldForm = Omit<World, 'id'>;

export interface Entry {
  readonly id: string;
  name: string;
  description: string;
  image: string;
  public: boolean;
  parent: {
    id: string;
    name: string;
  };
  category: 'NPC' | 'Location' | 'Lore' | 'Journal';
}
export type EntryForm = Omit<Entry, 'id'>;
