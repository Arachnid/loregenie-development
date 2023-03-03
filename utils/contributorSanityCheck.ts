import { getCampaignPermissions, getPermissions } from '@/lib/db';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { CampaignDB, PermissionLevel, WorldDB } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { Session, getServerSession } from 'next-auth';

export const contributorSanityCheck = async (
  request: NextApiRequest,
  response: NextApiResponse,
  updatedData: WorldDB | CampaignDB,
  priorData: WorldDB | CampaignDB | undefined,
  worldID?: string
): Promise<boolean> => {
  try {
    if (!priorData) {
      return false;
    }
    const session: Session | null = await getServerSession(
      request,
      response,
      authOptions
    );
    if (
      JSON.stringify({
        readers: updatedData.readers,
        writers: updatedData.writers,
        admins: updatedData.admins,
      }) !==
      JSON.stringify({
        readers: priorData.readers,
        writers: priorData.writers,
        admins: priorData.admins,
      })
    ) {
      let permissions: string[] = [];
      const email = session?.user?.email as string;
      if (worldID) {
        permissions = await getCampaignPermissions(
          worldID,
          updatedData.id,
          email
        );
      } else {
        permissions = await getPermissions(updatedData.id, email);
      }
      if (!permissions.includes(PermissionLevel.admin)) {
        return false;
      }
    }
    if (
      !updatedData.admins.every(
        (admin) =>
          updatedData.readers.includes(admin) ||
          updatedData.writers.includes(admin)
      )
    ) {
      return false;
    }
    if (
      !updatedData.writers.every((writer) =>
        updatedData.readers.includes(writer)
      )
    ) {
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
