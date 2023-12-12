import { WorldResponse } from "@/server/actions/world";
import { Campaign, Entry, World, WorldOrCampaignOrEntry } from "@/types";

export function isString(s: any): s is string {
  return typeof s === "string";
}

export function isWorldResponse(obj: any): obj is WorldResponse {
  return (
    obj &&
    isString(obj.name) &&
    isString(obj.description) &&
    isString(obj.imagePrompt)
  );
}

export function isWorld(
  obj: any,
): obj is WorldOrCampaignOrEntry & { worldID: string; initialData: World } {
  return (
    obj &&
    typeof obj === "object" &&
    "worldID" in obj &&
    typeof obj.worldID === "string"
  );
}

// Type guard for Campaign
export function isCampaign(obj: any): obj is WorldOrCampaignOrEntry & {
  campaignID: string;
  initialData: Campaign;
} {
  return (
    obj &&
    typeof obj === "object" &&
    "campaignID" in obj &&
    typeof obj.campaignID === "string"
  );
}

// Type guard for Entry
export function isEntry(
  obj: any,
): obj is WorldOrCampaignOrEntry & { entryID: string; initialData: Entry } {
  return (
    obj &&
    typeof obj === "object" &&
    "entryID" in obj &&
    typeof obj.entryID === "string"
  );
}
