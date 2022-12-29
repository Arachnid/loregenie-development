export interface Nav {
  key: string;
  children?: Nav[];
}

export interface LocationNav {
  key: string;
  children?: LocationNav;
}

export interface BaseCampaign {
  name: string;
  description: string;
  readers: string[];
  writers: string[];
  admins: string[];
  public: boolean;
}

export interface ExtendedCampaign extends BaseCampaign  {
  readonly id: string;
  nav: Nav[];
  owner: string;
  locationNav: LocationNav;
}

export interface Location {
  readonly id: string;
  campaign: string;
  name: string;
  description: string;
}

export interface LocationMap {
  [key: string]: Location,
}

export interface NPC {
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
