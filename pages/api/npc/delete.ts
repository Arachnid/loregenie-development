import { Converter, db } from '@/lib/db';
import { NPC } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { npcID, worldID }: { npcID: string; worldID: string } = JSON.parse(
    request.body
  );

  try {
    await db
      .collection('worlds')
      .doc(worldID)
      .collection('plotPoints')
      .doc(npcID)
      .withConverter(new Converter<NPC>())
      .delete();
  } catch (error) {
    console.log('error deleting npc from database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
