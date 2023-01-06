import { getLore } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Lore } from '@/types';
import ClientLorePage from '@/components/lore/ClientLorePage';

interface Props {
  params: {
    loreID: string;
    worldID: string;
  };
}

export default async function LorePage({ params }: Props) {
  const lore: Lore | undefined = await getLore(
    params.worldID,
    params.loreID
  );
  if (!lore) {
    notFound();
  }
  return <ClientLorePage lore={lore} worldID={params.worldID} />;
}
