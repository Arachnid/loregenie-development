import OpenAI from "openai";

export type SaveWorldFunctionData = {
  type: "world";
  name: string;
  content: string;
};

export const isSaveWorldFunctionData = (
  data: any,
): data is SaveWorldFunctionData => {
  return (
    data.type === "world" &&
    typeof data.name === "string" &&
    typeof data.content === "string"
  );
};

export const saveWorld: OpenAI.Beta.Assistants.AssistantCreateParams.AssistantToolsFunction =
  {
    type: "function",
    function: {
      name: "saveWorld",
      description: "Save the current entry for the world",
      parameters: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: ["world"],
          },
          name: {
            type: "string",
            description:
              "The name of the world being saved. If one is not in the chat then make one up.",
          },
          content: {
            type: "string",
            description:
              "The content of the world being saved. Use the text from the thread/chat as much as possible. " +
              "Be as descriptive as possible. Do not include a header item for the name. Include as much detail as possible. " +
              "Must format as markdown.",
          },
        },
        required: ["type", "name", "content"],
      },
    },
  };
