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
import { ASSISTANT_INSTRUCTIONS } from "@/prompts/system";
import { World, WorldDB } from "@/types";
import writeDataToFile from "@/utils/storeMessages";
import crypto from "crypto";
import { firestore } from "firebase-admin";
import { getServerSession } from "next-auth";
import OpenAI from "openai";
import Filter = firestore.Filter;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type WorldResponse = {
  name: string;
  description: string;
  imagePrompt: string;
};

export async function createWorld() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return {
      error: new Error("Invalid Email"),
      status: 401,
    };
  }

  const assistant = await openai.beta.assistants.create({
    instructions: ASSISTANT_INSTRUCTIONS,
    model: "gpt-4-1106-preview",
  });

  const threadId = (await openai.beta.threads.create()).id;

  try {
    const worldData = {
      name: "Untitled World",
      description: "",
      image: "",
      imagePrompt: "",
      readers: [email],
      writers: [email],
      admins: [email],
      public: false,
      prompt: "",
      assistantId: assistant.id,
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
      error: new Error("Invalid Email"),
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
        error: new Error("World not found"),
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
      error: new Error("Invalid Permissions"),
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
      error: new Error("Invalid Email"),
      status: 401,
    };
  }

  if (!worldData.id) {
    return {
      error: new Error("Invalid World ID"),
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
        error: new Error("World not found"),
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
          error: new Error("Failed to retrieve updated data."),
          status: 500,
        };
      }
    }

    return {
      error: new Error("Invalid Permissions"),
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
      error: new Error("Invalid Email"),
      status: 401,
    };
  }

  try {
    const worldRef = db.collection("worlds").doc(worldID);

    const worldSnapshot = await worldRef.get();
    const worldDB = worldSnapshot.data();

    if (!worldDB) {
      return {
        error: new Error("World not found"),
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
      error: new Error("Invalid Permissions"),
      status: 401,
    };
  } catch (error) {
    return {
      error,
      status: 500,
    };
  }
}

export async function createImage({
  prompt,
  size = "1792x1024",
}: {
  prompt: string;
  size: "256x256" | "512x512" | "1024x1024" | "1792x1024" | "1024x1792";
}) {
  const result = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    n: 1,
    size,
    response_format: "b64_json",
  });
  const image = result.data[0].b64_json as string;

  const fileRef = storage.bucket().file(`${crypto.randomUUID()}.png`);
  await fileRef.save(Buffer.from(image, "base64"));

  return {
    data: {
      url: fileRef.publicUrl(),
    },
    status: 200,
  };
}

export async function deleteWorldImage(worldID: string) {
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
      error: new Error("Invalid Permissions"),
      status: 401,
    };
  } catch (error) {
    return {
      error,
      status: 500,
    };
  }
}
