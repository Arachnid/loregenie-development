import { Converter, db } from '@/lib/db';
import { NPC } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const {
    npcData,
    npcID,
    settingID,
  }: { npcData: NPC; npcID: string; settingID: string } =
    JSON.parse(request.body);
  try {
    await db
      .collection('settings')
      .doc(settingID)
      .collection('plotPoints')
      .doc(npcID)
      .withConverter(new Converter<NPC>())
      .update(npcData);
  } catch (error) {
    console.log('error updating npc to database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
