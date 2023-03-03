import { Converter, db } from '@/lib/db';
import { aiGenerate } from '@/lib/ai';
import { WorldDB } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { contributorSanityCheck } from '@/utils/validation/contributorSanityCheck';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  let worldData: WorldDB = JSON.parse(request.body);
  if (worldData.prompt) {
    const prompt = worldData.prompt;
    worldData = Object.assign(
      worldData,
      await aiGenerate<Partial<WorldDB>>(
        'world',
        {
          name: 'Name for the setting',
          description: 'A 2-4 paragraph description of the setting',
        },
        [],
        prompt
      )
    );
  }

  try {
    if (!contributorSanityCheck({ request, response, clientData: worldData })) {
      response.statusCode = 500;
      response.send({});
      return;
    }
    const world = await db
      .collection('worlds')
      .withConverter(new Converter<WorldDB>())
      .add(worldData);
    response.json(world.id);
  } catch (error) {
    console.log('error writing world to database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
}
