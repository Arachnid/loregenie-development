"use server";

import { Converter, db, getCampaignEntries, getContributors } from "@/lib/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Campaign, CampaignDB, WorldDB } from "@/types";
import { getServerSession } from "next-auth";

type CreateCampaignArgs = {
  worldID: string;
};

export async function createCampaign({ worldID }: CreateCampaignArgs) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return {
      error: "Invalid Email",
      status: 401,
    };
  }

  try {
    const worldRef = db
      .collection("worlds")
      .doc(worldID)
      .withConverter(new Converter<WorldDB>());

    const worldSnapshot = await worldRef.get();
    const worldDB = worldSnapshot.data();

    if (!worldDB) {
      return {
        error: "World not found",
        status: 404,
      };
    }

    if (worldDB.admins.includes(email) || worldDB.writers.includes(email)) {
      let campaignRef;

      const campaignID = db.collection("campaigns").doc().id;

      campaignRef = worldRef
        .collection("campaigns")
        .doc(campaignID)
        .withConverter(new Converter<CampaignDB>());

      const campaignData = {
        id: campaignID,
        name: "New Campaign",
        description: "",
        image: "",
        imagePrompt: "",
        public: false,
        readers: [email],
        writers: [email],
        admins: [email],
        entries: [],
      } as CampaignDB;

      await campaignRef.set(campaignData);

      return {
        data: campaignData,
        status: 200,
      };
    }

    return {
      error: "User does not have permission to create a campaign",
      status: 401,
    };
  } catch (error) {
    return {
      error,
      status: 500,
    };
  }
}

type GetCampaignArgs = {
  worldID: string;
  campaignID: string;
};

export async function getCampaign({ worldID, campaignID }: GetCampaignArgs) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return {
      error: "Invalid Email",
      status: 401,
    };
  }

  try {
    const worldRef = db
      .collection("worlds")
      .doc(worldID)
      .withConverter(new Converter<WorldDB>());

    const worldSnapshot = await worldRef.get();
    const worldDB = worldSnapshot.data();

    if (!worldDB) {
      return {
        error: "World not found",
        status: 404,
      };
    }

    if (
      worldDB.admins.includes(email) ||
      worldDB.writers.includes(email) ||
      worldDB.readers.includes(email)
    ) {
      const campaignRef = worldRef
        .collection("campaigns")
        .doc(campaignID)
        .withConverter(new Converter<CampaignDB>());

      const campaignSnapshot = await campaignRef.get();
      const campaignDB = campaignSnapshot.data();

      if (!campaignDB) {
        return {
          error: "Campaign not found",
          status: 404,
        };
      }

      if (
        !(
          campaignDB.admins.includes(email) ||
          campaignDB.writers.includes(email) ||
          campaignDB.readers.includes(email)
        )
      ) {
        return {
          error: "Invalid Campaign Permissions",
        };
      }

      const campaign = async (): Promise<Campaign | undefined> => {
        if (campaignDB) {
          const entries = await getCampaignEntries(worldID, campaignDB.id);
          const contributors = await getContributors(worldID, campaignDB.id);
          return {
            ...campaignDB,
            entries,
            contributors,
          };
        }
        return undefined;
      };

      return {
        data: await campaign(),
        status: 200,
      };
    }

    return {
      error: "Invalid Permissions",
      status: 401,
    };
  } catch (error) {
    return {
      error,
      status: 500,
    };
  }
}

type UpdateCampaignArgs = {
  worldID: string;
  campaignID: string;
  campaignData: Partial<CampaignDB>;
};

export async function updateCampaign({
  worldID,
  campaignID,
  campaignData,
}: UpdateCampaignArgs) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return {
      error: "Invalid Email",
      status: 401,
    };
  }

  try {
    const worldRef = db
      .collection("worlds")
      .doc(worldID)
      .withConverter(new Converter<WorldDB>());

    const worldSnapshot = await worldRef.get();
    const worldDB = worldSnapshot.data();

    if (!worldDB) {
      return {
        error: "World not found",
        status: 404,
      };
    }

    if (
      worldDB.admins.includes(email) ||
      worldDB.writers.includes(email) ||
      worldDB.readers.includes(email)
    ) {
      const campaignRef = worldRef
        .collection("campaigns")
        .doc(campaignID)
        .withConverter(new Converter<CampaignDB>());

      const campaignSnapshot = await campaignRef.get();
      const campaignDB = campaignSnapshot.data();

      if (!campaignDB) {
        return {
          error: "Campaign not found",
          status: 404,
        };
      }

      if (
        !(
          campaignDB.admins.includes(email) ||
          campaignDB.writers.includes(email)
        )
      ) {
        return {
          error: "Invalid Campaign Permissions",
        };
      }

      const updatedCampaignData = {
        ...campaignDB,
        ...campaignData,
      };

      await campaignRef.set(updatedCampaignData);

      return {
        data: updatedCampaignData,
        status: 200,
      };
    }

    return {
      error: "Invalid Permissions",
      status: 401,
    };
  } catch (error) {
    return {
      error,
      status: 500,
    };
  }
}

type DeleteCampaignArgs = {
  worldID: string;
  campaignID: string;
};

export async function deleteCampaign({
  worldID,
  campaignID,
}: DeleteCampaignArgs) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return {
      error: "Invalid Email",
      status: 401,
    };
  }

  try {
    const worldRef = db
      .collection("worlds")
      .doc(worldID)
      .withConverter(new Converter<WorldDB>());

    const worldSnapshot = await worldRef.get();
    const worldDB = worldSnapshot.data();

    if (!worldDB) {
      return {
        error: "World not found",
        status: 404,
      };
    }

    if (
      worldDB.admins.includes(email) ||
      worldDB.writers.includes(email) ||
      worldDB.readers.includes(email)
    ) {
      const campaignRef = worldRef
        .collection("campaigns")
        .doc(campaignID)
        .withConverter(new Converter<CampaignDB>());

      const campaignSnapshot = await campaignRef.get();
      const campaignDB = campaignSnapshot.data();

      if (!campaignDB) {
        return {
          error: "Campaign not found",
          status: 404,
        };
      }

      if (
        !(
          campaignDB.admins.includes(email) ||
          campaignDB.writers.includes(email)
        )
      ) {
        return {
          error: "Invalid Campaign Permissions",
        };
      }

      await campaignRef.delete();

      return {
        data: campaignDB,
        status: 200,
      };
    }

    return {
      error: "Invalid Permissions",
      status: 401,
    };
  } catch (error) {
    return {
      error,
      status: 500,
    };
  }
}
