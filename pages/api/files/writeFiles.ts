import writeDataToFile from '@/utils/storeMessages';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse
  ) {
    
  const { messages, airesponse, id } = JSON.parse(request.body);

  try {
    const data = await writeDataToFile(id as string, [...messages, {"role": "assistant", "content": JSON.stringify(airesponse)}], './messages');
    

    response.json(data);
  } catch (error: any) {
    response.status(500).json({ error: error.message });
  }
}