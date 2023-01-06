import { Converter, db } from '@/lib/db';
import { NPC, PlotPoints } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { npcData, worldID }: { npcData: NPC; worldID: string } = JSON.parse(
    request.body
  );
  try {
    const npc = await db
      .collection('worlds')
      .doc(worldID)
      .collection('plotPoints')
      .withConverter(new Converter<PlotPoints>())
      .add(npcData);
    response.json(npc.id);
  } catch (error) {
    console.log('error writing npc to database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
}
