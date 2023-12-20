import OpenAI from "openai";

export const save: OpenAI.Beta.Assistants.AssistantCreateParams.AssistantToolsFunction =
  {
    type: "function",
    function: {
      name: "save",
      description: "Save the current entry for the world, campaign, or entity",
      parameters: {
        type: "object",
        properties: {
          entryType: {
            type: "string",
            enum: ["world", "campaign", "npc", "location", "lore", "journal"],
            description: "The type of entry to be saved",
          },
          content: {
            type: "array",
            description:
              "All the different items to be saved for the current entry. Broken down into a sub array of content for each unique, named item. " +
              "Every piece of information from the chat that is bold or a header should be saved as a separate item.",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "The name of the entry",
                },
                content: {
                  type: "string",
                  description:
                    "The content of the entry to be saved. 1-4 paragraphs but try and make as long and descriptive as possible. " +
                    "Use the text from the thread/chat as much as possible. Format as markdown.",
                },
              },
              required: ["name", "content"],
            },
          },
        },
        required: ["entryType", "content"],
      },
    },
  };
