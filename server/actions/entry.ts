"use server";

import { Converter, db } from "@/lib/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { CampaignDB, Category, Entry, WorldDB } from "@/types";
import { getServerSession } from "next-auth";

type CreateEntryArgs = {
  worldID: string;
  entryID?: string;
  campaignID?: string;
  category: Category;
  name?: string;
  description?: string;
};

export async function createEntry({
  worldID,
  entryID,
  campaignID,
  category,
  name,
  description,
}: CreateEntryArgs) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return {
      error: new Error("Invalid Email"),
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
        error: new Error("World not found"),
        status: 404,
      };
    }

    if (worldDB.admins.includes(email) || worldDB.writers.includes(email)) {
      let entryRef;

      if (campaignID) {
        const campaignRef = worldRef
          .collection("campaigns")
          .doc(campaignID)
          .withConverter(new Converter<CampaignDB>());

        const campaignSnapshot = await campaignRef.get();
        const campaignDB = campaignSnapshot.data();

        if (!campaignDB) {
          return {
            error: new Error("Campaign not found"),
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
            error: new Error("Invalid Campaign Permissions"),
          };
        }

        entryRef = campaignRef
          .collection("entries")
          .withConverter(new Converter<Entry>());
      } else {
        entryRef = worldRef
          .collection("entries")
          .withConverter(new Converter<Entry>());
      }

      let parent = null;

      if (entryID) {
        const parentSnapshot = await entryRef.doc(entryID).get();
        const parentData = parentSnapshot.data();

        if (parentData) {
          parent = {
            id: parentData.id,
            name: parentData.name,
          };
        }
      }

      const newEntry = {
        name: name ?? `Untitled ${category}`,
        description: description ?? "",
        prompt: "",
        image: "",
        imagePrompt: "",
        public: false,
        parent,
        category,
      } as Entry;

      const entrySnapshot = (await entryRef.add(newEntry)).get();
      const entry = (await entrySnapshot).data();

      return {
        entry,
        status: 200,
      };
    }

    return {
      error: new Error("Invalid World Permissions"),
      status: 401,
    };
  } catch (error) {
    return {
      error,
      status: 500,
    };
  }
}

type GetEntryArgs = {
  worldID: string;
  entryID: string;
  campaignID?: string;
};

export async function getEntry({ worldID, entryID, campaignID }: GetEntryArgs) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return {
      error: new Error("Invalid Email"),
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
        error: new Error("World not found"),
        status: 404,
      };
    }

    if (
      worldDB.admins.includes(email) ||
      worldDB.writers.includes(email) ||
      worldDB.readers.includes(email)
    ) {
      let entryRef;

      if (campaignID) {
        const campaignRef = worldRef
          .collection("campaigns")
          .doc(campaignID)
          .withConverter(new Converter<CampaignDB>());

        const campaignSnapshot = await campaignRef.get();
        const campaignDB = campaignSnapshot.data();

        if (!campaignDB) {
          return {
            error: new Error("Campaign not found"),
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
            error: new Error("Invalid Campaign Permissions"),
          };
        }

        entryRef = campaignRef
          .collection("entries")
          .doc(entryID)
          .withConverter(new Converter<Entry>());
      } else {
        entryRef = worldRef
          .collection("entries")
          .doc(entryID)
          .withConverter(new Converter<Entry>());
      }

      const entrySnapshot = await entryRef.get();
      const entryDB = entrySnapshot.data();

      if (!entryDB) {
        return {
          error: new Error("Entry not found"),
          status: 404,
        };
      }

      return {
        entry: entryDB,
        status: 200,
      };
    }

    return {
      error: new Error("Invalid World Permissions"),
      status: 401,
    };
  } catch (error) {
    return {
      error,
      status: 500,
    };
  }
}

type UpdateEntryArgs = {
  worldID: string;
  entryID: string;
  campaignID?: string;
  entryData: Partial<Entry>;
};

export async function updateEntry({
  worldID,
  entryID,
  campaignID,
  entryData,
}: UpdateEntryArgs) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return {
      error: new Error("Invalid Email"),
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
        error: new Error("World not found"),
        status: 404,
      };
    }

    if (worldDB.admins.includes(email) || worldDB.writers.includes(email)) {
      let entryRef;

      if (campaignID) {
        const campaignRef = worldRef
          .collection("campaigns")
          .doc(campaignID)
          .withConverter(new Converter<CampaignDB>());

        const campaignSnapshot = await campaignRef.get();
        const campaignDB = campaignSnapshot.data();

        if (!campaignDB) {
          return {
            error: new Error("Campaign not found"),
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
            error: new Error("Invalid Campaign Permissions"),
          };
        }

        entryRef = campaignRef
          .collection("entries")
          .doc(entryID)
          .withConverter(new Converter<Entry>());
      } else {
        entryRef = worldRef
          .collection("entries")
          .doc(entryID)
          .withConverter(new Converter<Entry>());
      }

      const entrySnapshot = await entryRef.get();
      const entryDB = entrySnapshot.data();

      if (!entryDB) {
        return {
          error: new Error("Entry not found"),
          status: 404,
        };
      }

      await entryRef.set(entryData, { merge: true });

      return {
        status: 200,
      };
    }

    return {
      error: new Error("Invalid World Permissions"),
      status: 401,
    };
  } catch (error) {
    return {
      error,
      status: 500,
    };
  }
}

type DeleteEntryArgs = {
  worldID: string;
  entryID: string;
  campaignID?: string;
};

export async function deleteEntry({
  worldID,
  entryID,
  campaignID,
}: DeleteEntryArgs) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return {
      error: new Error("Invalid Email"),
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
        error: new Error("World not found"),
        status: 404,
      };
    }

    if (worldDB.admins.includes(email) || worldDB.writers.includes(email)) {
      let entryRef;

      if (campaignID) {
        const campaignRef = worldRef
          .collection("campaigns")
          .doc(campaignID)
          .withConverter(new Converter<CampaignDB>());

        const campaignSnapshot = await campaignRef.get();
        const campaignDB = campaignSnapshot.data();

        if (!campaignDB) {
          return {
            error: new Error("Campaign not found"),
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
            error: new Error("Invalid Campaign Permissions"),
          };
        }

        entryRef = campaignRef
          .collection("entries")
          .doc(entryID)
          .withConverter(new Converter<Entry>());
      } else {
        entryRef = worldRef
          .collection("entries")
          .doc(entryID)
          .withConverter(new Converter<Entry>());
      }

      const entrySnapshot = await entryRef.get();
      const entryDB = entrySnapshot.data();

      if (!entryDB) {
        return {
          error: new Error("Entry not found"),
          status: 404,
        };
      }

      await entryRef.delete();

      return {
        status: 200,
      };
    }

    return {
      error: new Error("Invalid World Permissions"),
      status: 401,
    };
  } catch (error) {
    return {
      error,
      status: 500,
    };
  }
}
