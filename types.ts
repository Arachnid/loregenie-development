export interface Setting {
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

export type Item = Record<string, Location | NPC>

export interface Nav {
  key: string;
  children?: Nav[];
}

export interface LocationNav {
  key: string;
  children?: LocationNav;
}

export interface Campaign {
  readonly id: string;
  name: string;
  description: string;
  readers: string[];
  writers: string[];
  admins: string[];
  public: boolean;
}

export interface BaseLocation {
  campaign: string;
  name: string;
  description: string;
  public: boolean;
}

export interface Location extends BaseLocation {
  readonly id: string;
}

export interface LocationMap {
  [key: string]: Location,
}

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
}

export interface NPCMap {
  [key: string]: NPC,
}
