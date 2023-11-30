import { AiAssistant } from "@/lib/aiAssistant";
import { storage } from "@/lib/db";
import crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { prompt, size } = JSON.parse(request.body);

  try {
    if (!prompt) {
      throw new Error("Prompt must be provided");
    }

    console.log(prompt);
    const ai = new AiAssistant();
    const image = await ai.generateImage({ prompt, size });
    console.log({ airesp: image });
    const fileRef = storage.bucket().file(`${crypto.randomUUID()}.png`);
    await fileRef.save(Buffer.from(image, "base64"));
    const ImgUrl = fileRef.publicUrl();
    console.log({ ImgUrl });
    response.json(ImgUrl);
  } catch (error: any) {
    response.status(500).json({ error: error.message });
  }
}
