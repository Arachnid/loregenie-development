export type PlotPoints = Location | NPC;

export interface Setting {
  readonly id?: string;
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

export interface Campaign {
  readonly id?: string;
  name: string;
  description: string;
  readers: string[];
  writers: string[];
  admins: string[];
  public: boolean;
}

export interface Location {
  readonly id?: string;
  name: string;
  description: string;
  public: boolean;
  parent?: string;
  plotPoint: 'Location';
}

export interface NPC {
  readonly id?: string;
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
  plotPoint: 'NPC';
}
