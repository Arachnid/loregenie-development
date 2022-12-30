import { Converter, db } from '@/lib/db';
import { NPC } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    await db.collection('npcs').withConverter(new Converter<NPC>()).add(JSON.parse(request.body));
  } catch (error) {
    console.log('error writing npc to database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
