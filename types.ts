export type PlotPoints = Location | NPC | Lore;
export type Forms =
  | WorldForm
  | CampaignForm
  | LocationForm
  | NPCForm
  | JournalEntryForm
  | LoreForm;

export interface World {
  readonly id: string;
  name: string;
  description: string;
  readers: string[];
  writers: string[];
  admins: string[];
  public: boolean;
  campaigns?: Campaign[];
  locations?: Location[];
  npcs?: NPC[];
}
export type WorldForm = Omit<World, 'id'>;

export interface Campaign {
  readonly id: string;
  name: string;
  description: string;
  readers: string[];
  writers: string[];
  admins: string[];
  public: boolean;
  journalEntries?: JournalEntry[];
}
export type CampaignForm = Omit<Campaign, 'id'>;

export interface Location {
  readonly id: string;
  name: string;
  description: string;
  public: boolean;
  parent?: string;
  plotPoint: 'Location';
}
export type LocationForm = Omit<Location, 'id'>;

export interface NPC {
  readonly id: string;
  name: string;
  gender: string;
  age: number;
  race: string;
  profession: string;
  alignment: string;
  appearance: string;
  background: string;
  diction: string;
  personality: string;
  summary: string;
  bonds: string[];
  ideals: string[];
  flaws: string[];
  public: boolean;
  parent?: string;
  plotPoint: 'NPC';
}
export type NPCForm = Omit<NPC, 'id'>;

export interface JournalEntry {
  readonly id: string;
  date: string;
  text: string;
  public: boolean;
}
export type JournalEntryForm = Omit<JournalEntry, 'id'>;

export interface Lore {
  readonly id: string;
  title: string;
  description: string;
  public: boolean;
  plotPoint: 'Lore';
}
export type LoreForm = Omit<Lore, 'id'>;
