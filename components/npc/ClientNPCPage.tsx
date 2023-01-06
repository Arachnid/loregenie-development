'use client';

import { NPC } from '@/types';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

interface Props {
  npc: NPC;
  worldID: string;
}

const ClientNPCPage = ({ npc, worldID }: Props) => {
  const router = useRouter();
  const onDelete = async () => {
    try {
      await fetch('/api/npc/delete', {
        method: 'POST',
        body: JSON.stringify({
          npcID: npc.id,
          worldID,
        }),
      });
      router.push(`/world/${worldID}`);
      router.refresh();
    } catch (error) {
      console.log('error deleting npc: ', error);
    }
  };
  return (
    <>
      <h1>name: {npc.name}</h1>
      <div>gender: {npc.gender}</div>
      <div>age: {npc.age}</div>
      <div>race: {npc.race}</div>
      <div>profession: {npc.profession}</div>
      <div>alignment: {npc.alignment}</div>
      <div>appearance: {npc.appearance}</div>
      <div>background: {npc.background}</div>
      <div>diction: {npc.diction}</div>
      <div>personality: {npc.personality}</div>
      <div>summary: {npc.summary}</div>
      <div>bonds: {npc.bonds.join(', ')}</div>
      <div>ideals: {npc.ideals.join(', ')}</div>
      <div>flaws: {npc.flaws.join(', ')}</div>
      <div>visibility: {npc.public ? 'public' : 'private'}</div>
      <Button
        color='error'
        variant='contained'
        sx={{ margin: 1 }}
        onClick={() => onDelete()}
      >
        Delete NPC
      </Button>
      <Button
        variant='contained'
        onClick={() => router.push(`/world/${worldID}/npc/${npc.id}/edit`)}
      >
        Edit NPC
      </Button>
      <Button onClick={() => router.push(`/world/${worldID}`)}>
        Return To World
      </Button>
    </>
  );
};

export default ClientNPCPage;
