"use server";

import {
  Converter,
  db,
  getCampaigns,
  getContributors,
  getEntries,
} from "@/lib/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { World, WorldDB } from "@/types";
import { getServerSession } from "next-auth";

export async function getAllWorlds() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return {
      data: [] as World[],
    };
  }

  try {
    const worldsDB = await db
      .collection("worlds")
      .where("readers", "array-contains", email)
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
    };
  } catch (error) {
    return {
      error,
    };
  }
}
