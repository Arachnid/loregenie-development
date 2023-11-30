import GenerateFormPage from "@/components/pages/GenerateFormPage";
import { getPermissions, getWorld } from "@/lib/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { World } from "@/types";
import { getServerSession, Session } from "next-auth";
import { notFound } from "next/navigation";

type Props = {
  params: {
    worldID: string;
  };
};

const GenerateNewPage = async ({ params }: Props) => {
  const session: Session | null = await getServerSession(authOptions);
  const email = session?.user?.email;
  const world: World | undefined = await getWorld(
    params.worldID,
    email as string,
  );

  if (!email || !world) {
    notFound();
  }

  const permissions = await getPermissions(email, params.worldID);

  return (
    <GenerateFormPage
      world={world}
      entries={world.entries}
      campaigns={world.campaigns}
      permissions={permissions}
    />
  );
};

export default GenerateNewPage;
