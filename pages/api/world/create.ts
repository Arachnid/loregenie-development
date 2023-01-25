import { Converter, db } from '@/lib/db';
import { World } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const worldData: World = JSON.parse(request.body);
  try {
    const world = await db
      .collection('worlds')
      .withConverter(new Converter<World>())
      .add(worldData);
    response.json(world.id);
  } catch (error) {
    console.log('error writing world to database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
}
