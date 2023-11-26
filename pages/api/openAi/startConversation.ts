import { modifyResponse } from '@/lib/ai';
import { AiAssistant } from '@/lib/aiAssistant';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse
  ) {
    
  const { world, message } = JSON.parse(request.body);

  try {


    // const data = await readDataFromFile(id as string, './messages');
    // const data = await modifyResponse(prompt, messages);
    const ai = new AiAssistant(world);
    const res = await ai.startConversation({message});
    console.log({res})

    response.json(res);
  } catch (error: any) {
    response.status(500).json({ error: error.message });
  }
}