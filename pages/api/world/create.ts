import crypto from 'crypto';
import { Converter, db, storage } from '@/lib/db';
import { aiGenerate, aiGenerateImage } from '@/lib/ai';
import { World, WorldDB } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { contributorSanityCheck } from '@/utils/validation/contributorSanityCheck';
import writeDataToFile from '@/utils/storeMessages';
import { ChatCompletionMessageParam } from 'openai/resources';
import { AiAssistant } from '@/lib/aiAssistant';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  let worldData: WorldDB = JSON.parse(request.body);
  let msgHistory: Array<ChatCompletionMessageParam> = [];
  let assistantResponse: any;

  if (worldData.prompt) {
    const prompt = worldData.prompt;


    const { response, messages } = await aiGenerate<Partial<WorldDB>>(
      'world',
      {
        name: 'Name for the setting',
        description: 'A detailed, 2-4 paragraph description of the setting',
        imagePrompt: 'A description of a header image that captures the setting, written in a way that someone who has never heard of the setting could paint a picture.'
      },
      [],
      prompt
    )

    msgHistory = messages;
    assistantResponse = response;
    worldData = Object.assign( worldData, response );

    const image = await aiGenerateImage(worldData.imagePrompt, '1792x1024');
    const fileRef = storage.bucket().file(`${crypto.randomUUID()}.png`);
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


      const worldSnapshot = await world.get();
      const data = worldSnapshot.data();
    
      console.log({data_of_world: data})
    
      writeDataToFile( world.id, data, './messages');

    const ai = new AiAssistant(world as any);
    const res = await ai.startConversation({message: `tell me about ${data?.name}`});

    // writeDataToFile( world.id, [...msgHistory, {"role": "assistant", "content": JSON.stringify(assistantResponse)}], './messages');

    response.json(world.id);

  } catch (error) {
    console.log('error writing world to database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
}
