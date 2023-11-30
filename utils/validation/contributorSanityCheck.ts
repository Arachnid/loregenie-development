import { getPermissions } from "@/lib/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { CampaignDB, PermissionLevel, WorldDB } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, Session } from "next-auth";

export type ContributorSanityCheck = {
  request: NextApiRequest;
  response: NextApiResponse;
  clientData: WorldDB | CampaignDB;
  dbData?: WorldDB | CampaignDB;
  worldID?: string;
};

export const contributorSanityCheck = async (
  options: ContributorSanityCheck,
): Promise<boolean> => {
  const { request, response, clientData, dbData, worldID } = options;

  try {
    const session: Session | null = await getServerSession(
      request,
      response,
      authOptions,
    );

    if (dbData && contributorsHaveBeenAltered(clientData, dbData)) {
      let permissions: string[] = [];
      const email = session?.user?.email as string;
      if (worldID) {
        permissions = await getPermissions(email, worldID, clientData.id);
      } else {
        permissions = await getPermissions(email, clientData.id);
      }
      if (!permissions.includes(PermissionLevel.admin)) {
        return false;
      }
    }
    if (!isAdminAReaderAndWriter(clientData) || !isWriterAReader(clientData)) {
      return false;
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const contributorsHaveBeenAltered = (
  clientData: WorldDB | CampaignDB,
  dbData: WorldDB | CampaignDB,
): boolean =>
  JSON.stringify({
    readers: clientData.readers,
    writers: clientData.writers,
    admins: clientData.admins,
  }) !==
  JSON.stringify({
    readers: dbData.readers,
    writers: dbData.writers,
    admins: dbData.admins,
  });

const isAdminAReaderAndWriter = (clientData: WorldDB | CampaignDB) =>
  clientData.admins.every(
    (admin) =>
      clientData.readers.includes(admin) || clientData.writers.includes(admin),
  );

const isWriterAReader = (clientData: WorldDB | CampaignDB) =>
  clientData.writers.every((writer) => clientData.readers.includes(writer));
