import { Category } from "@/types";
import OpenAI from "openai";

export type SaveEntryFunctionData = {
  type: "entry";
  entries: Array<{
    category: Category;
    parentEntry?: string | null;
    name: string;
    content: string;
  }>;
};

export const isSaveEntryFunctionData = (
  data: any,
): data is SaveEntryFunctionData => {
  return data.type === "entry" && Array.isArray(data.entries);
};

export const saveEntries: OpenAI.Beta.Assistants.AssistantCreateParams.AssistantToolsFunction =
  {
    type: "function",
    function: {
      name: "saveEntries",
      description: "Save the entries for the world, campaign, or entity.",
      parameters: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: ["entry"],
          },
          entries: {
            type: "array",
            description:
              "An array of entries to save. One entry for each distinct element from the chat. A distinct element is defined as a named element that is either bold, in a header, or is an item from a list. " +
              "Do not include duplicates.",
            items: {
              type: "object",
              properties: {
                category: {
                  type: "string",
                  enum: Object.values(Category),
                  description: "The category of entry to be saved",
                },
                parentEntry: {
                  type: "string",
                  description:
                    "The name of the parent entry from the chat. If the entry is a completely new entry then this should be null.",
                },
                name: {
                  type: "string",
                  description:
                    "The name of the entry being saved. If one is not in the chat then make one up.",
                },
                content: {
                  type: "string",
                  description:
                    "The content of the entry being saved. Use the text from the thread/chat as much as possible. " +
                    "Be as descriptive as possible. " +
                    "Do not include a header item for the name. " +
                    "Do not include a name line item. " +
                    "Include as much detail as possible. " +
                    "Must format as markdown.",
                },
              },
              required: ["category", "parentEntry", "name", "content"],
            },
          },
        },
        required: ["type", "entries"],
      },
    },
  };
