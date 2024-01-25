"use server";

import {
  Converter,
  db,
  getCampaigns,
  getContributors,
  getEntries,
  storage,
} from "@/lib/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { World, WorldDB } from "@/types";
import writeDataToFile from "@/utils/storeMessages";
import { firestore } from "firebase-admin";
import { getServerSession } from "next-auth";
import OpenAI from "openai";
import Filter = firestore.Filter;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type NewWorldArgs = {
  name: string;
  description: string;
  assistantId: string;
  threadId: string;
};

export type WorldResponse = {
  name: string;
  description: string;
  imagePrompt: string;
};

export async function createWorld({
  name,
  description,
  assistantId,
  threadId,
}: NewWorldArgs) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return {
      error: "Invalid Email",
      status: 401,
    };
  }

  try {
    const worldData = {
      name,
      description,
      image: "",
      imagePrompt: "",
      readers: [email],
      writers: [email],
      admins: [email],
      public: false,
      prompt: "",
      assistantId,
      threadId,
    } as WorldDB;

    const world = await db
      .collection("worlds")
      .withConverter(new Converter<WorldDB>())
      .add(worldData);

    const worldSnapshot = await world.get();
    const data = worldSnapshot.data();

    writeDataToFile(world.id, data, "./messages");

    return {
      data,
      status: 200,
    };
  } catch (error) {
    return {
      error,
      status: 500,
    };
  }
}

export async function getAllWorlds() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return {
      data: [] as World[],
    };
  }

  try {
    const orFilter = Filter.or(
      Filter.where("admins", "array-contains", email),
      Filter.where("readers", "array-contains", email),
      Filter.where("writers", "array-contains", email),
    );
    const worldsDB = await db
      .collection("worlds")
      .where(orFilter)
      .withConverter(new Converter<WorldDB>())
      .get();

    const data = await Promise.all(
      worldsDB.docs.map(async (world): Promise<World> => {
        const worldData = world.data();
        const contributors = await getContributors(world.id);
        const entries = await getEntries(
          world.id,
          worldData.public,
          worldData.readers.includes(email),
        );
        const campaigns = await getCampaigns(world.id, email);

        return {
          ...worldData,
          contributors,
          entries,
          campaigns,
        };
      }),
    );

    return {
      data,
      status: 200,
    };
  } catch (error) {
    return {
      error: "Failed to retrieve worlds",
      status: 500,
    };
  }
}

export async function getWorld(worldID: string) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return {
      error: "Invalid Email",
      status: 401,
    };
  }

  try {
    const worldDB = (
      await db
        .collection("worlds")
        .doc(worldID)
        .withConverter(new Converter<WorldDB>())
        .get()
    ).data();

    if (!worldDB) {
      return {
        error: "World not found",
        status: 404,
      };
    }

    if (
      worldDB.readers.includes(email) ||
      worldDB.public ||
      worldDB.admins.includes(email) ||
      worldDB.writers.includes(email)
    ) {
      const entries = await getEntries(
        worldDB.id,
        worldDB.public,
        worldDB.readers.includes(email),
      );
      const campaigns = await getCampaigns(worldDB.id, email);
      const contributors = await getContributors(worldDB.id);
      return {
        data: {
          ...worldDB,
          entries,
          campaigns,
          contributors,
        } as World,
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

export async function updateWorld(worldData: Partial<WorldDB>) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return {
      error: "Invalid Email",
      status: 401,
    };
  }

  if (!worldData.id) {
    return {
      error: "Invalid World ID",
      status: 400,
    };
  }

  try {
    const worldRef = db
      .collection("worlds")
      .doc(worldData.id)
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
      await worldRef.update({
        ...worldDB,
        ...worldData,
      });

      const updatedDoc = await worldRef.get();
      const updatedData = updatedDoc.data();

      if (updatedData) {
        return {
          data: updatedData,
          status: 200,
        };
      } else {
        return {
          error: "Failed to retrieve updated data.",
          status: 500,
        };
      }
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

export async function deleteWorld(worldID: string) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return {
      error: "Invalid Email",
      status: 401,
    };
  }

  try {
    const worldRef = db.collection("worlds").doc(worldID);

    const worldSnapshot = await worldRef.get();
    const worldDB = worldSnapshot.data();

    if (!worldDB) {
      return {
        error: "World not found",
        status: 404,
      };
    }

    if (worldDB.admins.includes(email)) {
      await db.recursiveDelete(worldRef);

      return {
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

export async function deleteWorldImage(worldID: string) {
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
      await worldRef.update({
        image: "",
      });

      const fileRef = storage.bucket().file(worldDB.image);
      await fileRef.delete();

      return {
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

export async function getWorldThreadMessages(worldID: string) {
  const world = await getWorld(worldID);

  if (world.status !== 200) {
    return {
      error: world.error,
      status: world.status,
    };
  }

  const worldData = world.data;

  if (!worldData) {
    return {
      error: "World not found",
      status: 404,
    };
  }

  if (!worldData.threadId) {
    return {
      error: "World thread not found",
      status: 404,
    };
  }

  const threadMessages = await openai.beta.threads.messages.list(
    worldData.threadId,
  );

  return {
    data: threadMessages.data.reverse(),
    status: 200,
  };
}
