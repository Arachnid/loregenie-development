import { modifyResponse } from "@/lib/ai";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { prompt, messages } = JSON.parse(request.body);

  try {
    console.log(messages);

    // const data = await readDataFromFile(id as string, './messages');
    const data = await modifyResponse(prompt, messages);

    response.json(data);
  } catch (error: any) {
    response.status(500).json({ error: error.message });
  }
}
