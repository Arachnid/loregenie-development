import ClientEntriesNav from "@/components/nav/ClientEntriesNav";
import EntriesList from "@/components/nav/EntriesList";

export default function EntriesNav({
  worldID,
  email,
  permissions,
  world,
}: any) {
  // let world: World | undefined | any;
  // let permissions: any;

  // try {
  //   world = getWorld(worldID, email);
  //   if (!world) {
  //     throw new Error('World not found');
  //   }
  //   permissions =  getPermissions(email, worldID);
  // } catch (error) {
  //   // Handle error
  //   console.error(error);
  //   return <div>Error loading data</div>; // or use notFound() as per your app's logic
  // }

  return (
    <ClientEntriesNav
      worldID={worldID}
      permissions={permissions}
      entries={world.entries}
      campaigns={world.campaigns}
    >
      <EntriesList
        entries={world.entries}
        campaigns={world.campaigns}
        world={world}
      />
    </ClientEntriesNav>
  );
}
