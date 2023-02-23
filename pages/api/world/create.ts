import { Converter, db } from '@/lib/db';
import { aiGenerate } from '@/lib/ai';
import { World } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  let worldData: Partial<World> = JSON.parse(request.body);
  if(worldData.prompt) {
    const prompt = worldData.prompt;
    worldData = Object.assign(worldData, await aiGenerate<Partial<World>>('world', {
      name: 'Name for the setting',
      description: 'A 2-4 paragraph description of the setting',
    }, [], prompt));
  }
  try {
    const world = await db
      .collection('worlds')
      .withConverter(new Converter<Partial<World>>())
      .add(worldData);
    response.json(world.id);
  } catch (error) {
    console.log('error writing world to database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
}
