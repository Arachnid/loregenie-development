import { getPermissions, getWorld } from "@/lib/db";

export async function getWorldData(worldID: string, email: string) {
  const world = await getWorld(worldID, email);
  const permissions = world ? await getPermissions(email, worldID) : null;
  return { world, permissions };
}
