import { readDataFromFile } from "@/utils/storeMessages";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { id } = request.query;
  try {
    const data = await readDataFromFile(id as string, "./messages");

    response.json(data);
  } catch (error: any) {
    response.status(500).json({ error: error.message });
  }
}
