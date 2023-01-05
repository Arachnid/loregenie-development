import { Converter, db } from '@/lib/db';
import { NPC, PlotPoints } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { npcData, settingID }: { npcData: NPC; settingID: string } =
    JSON.parse(request.body);
  try {
    await db
      .collection('settings')
      .doc(settingID)
      .collection('plotPoints')
      .withConverter(new Converter<PlotPoints>())
      .add(npcData);
  } catch (error) {
    console.log('error writing npc to database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
