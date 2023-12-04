// ./app/api/chat/route.ts
import {
  experimental_StreamData,
  OpenAIStream,
  StreamingTextResponse,
} from "ai";
import OpenAI from "openai";
import { ChatCompletionCreateParams } from "openai/resources/chat";
import { ChatCompletionMessageParam } from "openai/src/resources/chat/completions";

export type WorldSetting = {
  scopeAndScale: string;
  basicGeography: string;
  climate: string;
  dayNightCycle: string;
  technologyLevel: string;
  magicLevel: string;
  historicalContext: string;
  inhabitants: string;
  overallAtmosphere: string;
};

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

const functions: ChatCompletionCreateParams.Function[] = [
  {
    name: "save_setting",
    description: "Save the current setting.",
    parameters: {
      type: "object",
      properties: {
        scopeAndScale: {
          type: "string",
          description:
            "The scope and scale of the setting from the conversation. 2-4 paragraphs.",
        },
        basicGeography: {
          type: "string",
          description:
            "The basic geography of the setting from the conversation. 2-4 paragraphs.",
        },
        climate: {
          type: "string",
          description:
            "The climate of the setting from the conversation. 1-4 paragraphs.",
        },
        dayNightCycle: {
          type: "string",
          description:
            "The day/night cycle of the setting from the conversation. 1-4 paragraphs.",
        },
        technologyLevel: {
          type: "string",
          description:
            "The technology level of the setting from the conversation. 1-4 paragraphs.",
        },
        magicLevel: {
          type: "string",
          description:
            "The magic level of the setting from the conversation. 1-4 paragraphs.",
        },
        historicalContext: {
          type: "string",
          description:
            "The historical context of the setting from the conversation. 2-4 paragraphs.",
        },
        inhabitants: {
          type: "array",
          description: "The inhabitants of the setting from the conversation.",
          items: {
            type: "string",
            description:
              "An inhabitant of the setting and some simple details about them. 1-4 paragraphs.",
          },
        },
        overallAtmosphere: {
          type: "string",
          description:
            "The overall atmosphere of the setting from the conversation. 2-4 paragraphs.",
        },
      },
      required: [
        "scope",
        "basicGeography",
        "climate",
        "dayNightCycle",
        "technologyLevel",
        "magicLevel",
        "historicalContext",
        "inhabitants",
        "overallAtmosphere",
      ],
    },
  },
];

const baseMessages: Array<ChatCompletionMessageParam> = [
  {
    role: "system",
    content: `
    Purpose: 
    You are the 'D&D World Weaver', a dedicated guide for creating rich, diverse, and engaging Dungeons & Dragons (D&D) settings. Your role is to assist users in crafting imaginative, unique, and cohesive worlds for their D&D campaigns.

    Capabilities:
    Generate detailed descriptions of fantasy or sci-fi worlds and settings. Focus solely on the world itself. Never include characters, landmarks, cities/towns, plot, or story elements.
    
    Offer guidance on incorporating various fantasy themes and genres into D&D settings.
    Tone: The communication style should be enthusiastic, friendly, and supportive, using language that is easy to understand and engaging. Encourage creativity and exploration in users, inspiring them to develop their ideas further.
    
    Interaction Style:
    Be receptive to the user's ideas, building upon them with creative suggestions.
    Maintain a light-hearted and encouraging tone to keep the creative process fun and engaging.
    Provide clear, concise information, balanced with imaginative and descriptive storytelling.
    
    Usage Context: 
    Ideal for Dungeon Masters and players looking to enhance their D&D campaign settings, develop intricate storylines, and deepen the immersion of their role-playing experience.
  
    Delivery Method: 
    Use Markdown to format the output text. The output should be a single, cohesive document that can be easily read and understood by the user. Do not include multiple line breaks or empty lines between paragraphs.
  
    When you think the setting is complete you must prompt the user to complete the conversation by asking them to "save" then you can use the 'save_setting' function to save the setting. After a successful save you should end the conversation.
  `,
  },
];

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { messages } = await req.json();

  const accumulatedMessagse: Array<ChatCompletionMessageParam> = messages ?? [];

  accumulatedMessagse.unshift(baseMessages[0]);

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0613",
    stream: true,
    messages: accumulatedMessagse,
    functions,
  });

  const data = new experimental_StreamData();

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response, {
    experimental_onFunctionCall: async (
      { name: functionName, arguments: functionArgs },
      createFunctionCallMessages,
    ) => {
      if (functionName === "save_setting") {
        const {
          scopeAndScale,
          basicGeography,
          climate,
          dayNightCycle,
          technologyLevel,
          magicLevel,
          historicalContext,
          inhabitants,
          overallAtmosphere,
        } = functionArgs as WorldSetting;

        const d = {
          scopeAndScale,
          basicGeography,
          climate,
          dayNightCycle,
          technologyLevel,
          magicLevel,
          historicalContext,
          inhabitants,
          overallAtmosphere,
        };

        data.append(d);

        const newMessages = createFunctionCallMessages(d);

        console.log("WAT", newMessages);
      }
    },
    onCompletion(completion) {
      console.log("completion", completion);
    },
    onFinal(completion) {
      data.close();
    },
    experimental_streamData: true,
  });
  // Respond with the stream
  return new StreamingTextResponse(stream, {}, data);
}
