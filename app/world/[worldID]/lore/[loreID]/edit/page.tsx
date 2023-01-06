import { getLore } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Lore } from '@/types';
import LoreForm from '@/components/lore/LoreForm';

interface Props {
  params: {
    worldID: string;
    loreID: string;
  };
}

export default async function EditLorePage({ params }: Props) {
  const lore: Lore | undefined = await getLore(params.worldID, params.loreID);
  if (!lore) {
    notFound();
  }
  return <LoreForm lore={lore} worldID={params.worldID} />;
}
