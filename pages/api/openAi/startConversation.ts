import { AiAssistant } from '@/lib/aiAssistant';
import { World, WorldDB } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse
  ) {
    
  const { world, message }:{world: World | WorldDB, message: any} = JSON.parse(request.body);

  try {

    const ai = new AiAssistant();
    const res = await ai.startConversation({message,assistantId: world.assistantId, threadId: world.threadId, world: world});

    response.json(res);
  } catch (error: any) {
    response.status(500).json({ error: error.message });
  }
}