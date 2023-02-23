import { Campaign, Entry, isCampaign, isEntry } from '@/types';
import { SetStateAction } from 'react';

export const filterLogic = (
  generate: boolean | undefined,
  schema: Campaign | Entry,
  data: Entry,
  setData: (value: SetStateAction<Entry>) => void
): void => {
  if (isEntry(schema) && schema.campaign) {
    buildCampaignEntryOnClick(generate, schema, data, setData);
  } else if (isEntry(schema)) {
    buildEntryOnClick(generate, schema, data, setData);
  } else if (isCampaign(schema)) {
    buildCampaignOnClick(generate, schema, data, setData);
  } else {
    buildWorldOnClick(generate, data, setData);
  }
};
const buildCampaignEntryOnClick = (
  generate: boolean | undefined,
  schema: Entry,
  data: Entry,
  setData: (value: SetStateAction<Entry>) => void
): void => {
  if (schema.campaign) {
    if (generate) {
      const { category, ...remainder } = data;
      setData({
        ...remainder,
        parent: {
          name: schema.name,
          id: schema.id,
        },
        campaign: {
          id: schema.campaign.id,
          name: schema.campaign.name,
        },
      });
    } else {
      setData({
        ...data,
        parent: {
          name: schema.name,
          id: schema.id,
        },
        campaign: {
          id: schema.campaign.id,
          name: schema.campaign.name,
        },
      });
    }
  }
};

const buildEntryOnClick = (
  generate: boolean | undefined,
  schema: Entry,
  data: Entry,
  setData: (value: SetStateAction<Entry>) => void
): void => {
  if (generate) {
    const { campaign, category, ...state } = data;
    setData({
      ...state,
      parent: {
        name: schema.name,
        id: schema.id,
      },
    });
  } else {
    setData({
      ...data,
      parent: {
        name: schema.name,
        id: schema.id,
      },
    });
  }
};

const buildCampaignOnClick = (
  generate: boolean | undefined,
  schema: Campaign,
  data: Entry,
  setData: (value: SetStateAction<Entry>) => void
): void => {
  if (generate) {
    const { parent, category, ...state } = data;
    setData({
      ...state,
      campaign: { name: schema.name, id: schema.id },
    });
  } else {
    setData({
      ...data,
      campaign: { name: schema.name, id: schema.id },
    });
  }
};

const buildWorldOnClick = (
  generate: boolean | undefined,
  data: Entry,
  setData: (value: SetStateAction<Entry>) => void
): void => {
  if (generate) {
    const { parent, campaign, category, ...state } = data;
    setData({ ...state });
  } else {
    setData({ ...data });
  }
};
