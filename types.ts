export interface Nav {
  key: string;
  children?: Nav[];
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
