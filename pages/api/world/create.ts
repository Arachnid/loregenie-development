import { Converter, db, storage } from '@/lib/db';
import { aiGenerate, aiGenerateImage } from '@/lib/ai';
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
          description: 'A detailed, 2-4 paragraph description of the setting',
          imageDescription: 'A description of a header image that captures the setting, written in a way that someone who has never heard of the setting could paint a picture.'
        },
        [],
        prompt
      )
    );
    const image = await aiGenerateImage(worldData.imageDescription);
    const fileRef = storage.bucket().file('world.png');
    await fileRef
      .save(
        Buffer.from(
          image,
          'base64'
        )
      );
    worldData.image = fileRef.publicUrl();
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
