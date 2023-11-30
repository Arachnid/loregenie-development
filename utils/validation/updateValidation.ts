import { CampaignDB, PermissionLevel, WorldDB } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";
import { contributorSanityCheck } from "./contributorSanityCheck";
import { hasPermission } from "./hasPermission";

export const updateValidation = async (
  request: NextApiRequest,
  response: NextApiResponse,
  clientData: WorldDB | CampaignDB,
  dbData: WorldDB | CampaignDB | undefined,
): Promise<boolean> => {
  if (!dbData) {
    return false;
  }

  if (
    !(await hasPermission(
      request,
      response,
      clientData.id,
      PermissionLevel.writer,
    ))
  ) {
    return false;
  }

  if (
    !(await contributorSanityCheck({
      request,
      response,
      clientData,
      dbData,
    }))
  ) {
    return false;
  }
  return true;
};
