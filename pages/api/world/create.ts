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

    const INSTRUCTION_FOR_WORLD_CREATION =
      `
        The user is requesting a world. Here is relevant context to the setting in which this world exists:

        Respond with a JSON object, following this template exactly, no markdown:

        ---
        - name: Name for the setting
        - description: A detailed, 2-4 paragraph description of the setting
        - imagePrompt: A description of a header image that captures the setting, written in a way that someone who has never heard of the setting could paint a picture.
        ---

      `;

      function cleanMarkdownToJson(text: any) {
        try {
          // Try to directly parse the text as JSON first
          return JSON.parse(text);
        } catch {
          // If direct parsing fails, assume Markdown formatting and clean it
          const cleanedText = text.replace(/```json\n|```/g, '').trim();
          try {
            return JSON.parse(cleanedText);
          } catch (error) {
            console.error('Failed to parse JSON:', error);
            return null;
          }
        }
    }

      //call open Ai to create world.
      const newAssistant = new AiAssistant();
      const worldPrompt = await newAssistant.startConversation({
        message: prompt,
        threadInstruction: INSTRUCTION_FOR_WORLD_CREATION
      });

      //get IDs
      worldData.assistantId = worldPrompt?.assistantId;
      worldData.threadId = worldPrompt?.threadId;


      // console.log({worldPrompt});
      const response = cleanMarkdownToJson(worldPrompt?.assistant_response);
      // console.log({worldObj: response})

      //store world & IDs

    worldData = Object.assign( worldData, response );
    
    // const image = await aiGenerateImage(worldData.imagePrompt, '1792x1024');
    const image = await newAssistant.generateImage({prompt: worldData.imagePrompt, size: '1792x1024'});
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

    writeDataToFile( world.id, data, './messages');

    response.json(world.id);

  } catch (error) {
    console.log('error writing world to database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
}
