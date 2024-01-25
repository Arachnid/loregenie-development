"use server";

import { Converter, db, storage } from "@/lib/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getEntry } from "@/server/actions/entry";
import {
  extractEntryContext,
  extractWorldContext,
} from "@/server/utils/worldUtils";
import { WorldDB } from "@/types";
import { getServerSession } from "next-auth";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export async function createImage({
  worldID,
  entryID,
  prompt,
  size = "1792x1024",
}: {
  worldID: string;
  entryID?: string;
  prompt?: string;
  size: "256x256" | "512x512" | "1024x1024" | "1792x1024" | "1024x1792";
}) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return {
      error: "Invalid Email",
      status: 401,
    };
  }

  try {
    const worldDB = (
      await db
        .collection("worlds")
        .doc(worldID)
        .withConverter(new Converter<WorldDB>())
        .get()
    ).data();

    if (!worldDB) {
      return {
        error: "World not found",
        status: 404,
      };
    }

    if (
      worldDB.readers.includes(email) ||
      worldDB.public ||
      worldDB.admins.includes(email) ||
      worldDB.writers.includes(email)
    ) {
      const worldContext = await extractWorldContext(worldID);
      if (worldContext.error) {
        return {
          error: worldContext.error,
          status: 500,
        };
      }

      let imagePrompt = `
      Create a description/prompt for a header image that captures the essence of the following world/entity; written in a way that someone who has never heard of the setting could paint a picture.
      
      World Context: ${worldContext.context}
      
      `;

      if (entryID) {
        const entry = await getEntry({
          worldID,
          entryID,
        });

        if (entry.error) {
          return {
            error: entry.error,
            status: 500,
          };
        }
        if (entry.entry) {
          const entryContext = extractEntryContext(entry.entry);

          if (entryContext.error) {
            return {
              error: entryContext.error,
              status: 500,
            };
          }

          imagePrompt += `
        Make the prompt about this ${entry.entry.category} named ${entry.entry.name}:

        Context/description of ${entry.entry.name}: ${entryContext.context}

        `;
        }
      }

      if (prompt) {
        imagePrompt += `\n Additional context: ${prompt}`;
      }

      const threadId = worldDB.threadId;
      if (!threadId) {
        return {
          error: "World does not have a thread",
          status: 500,
        };
      }
      if (!worldDB.assistantId) {
        return {
          error: "World does not have an assistant",
          status: 500,
        };
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: imagePrompt,
          },
        ],
      });

      const newPrompt = completion.choices[0].message.content;

      if (!newPrompt) {
        return {
          error: "Prompt not generated",
          status: 500,
        };
      }

      const result = await openai.images.generate({
        model: "dall-e-3",
        prompt: newPrompt,
        n: 1,
        size,
        response_format: "b64_json",
      });
      const image = result.data[0].b64_json as string;

      const fileRef = storage.bucket().file(`${crypto.randomUUID()}.png`);
      await fileRef.save(Buffer.from(image, "base64"));

      return {
        data: {
          url: fileRef.publicUrl(),
        },
        status: 200,
      };
    }

    return {
      error: "Invalid Permissions",
      status: 401,
    };
  } catch (error) {
    return {
      status: 500,
    };
  }
}
