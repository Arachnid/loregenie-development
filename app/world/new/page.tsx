"use client";

import { WorldSetting } from "@/app/api/generate/world/route";
import { FunctionCallHandler, nanoid } from "ai";
import { Message, useChat } from "ai/react";
import Markdown from "react-markdown";

// Generate a map of message role to text color
const roleToColorMap: Record<Message["role"], string> = {
  data: "text-green-950",
  system: "text-purple-950",
  user: "black",
  function: "text-blue-900",
  assistant: "text-purple-950",
};

const functionCallHandler: FunctionCallHandler = async (
  chatMessages,
  functionCall,
) => {
  console.log("In functionCallHandler", functionCall);
  if (functionCall.name === "save_setting") {
    if (functionCall.arguments) {
      // Parsing here does not always work since it seems that some characters in generated code aren't escaped properly.
      const parsedFunctionCallArguments: WorldSetting = JSON.parse(
        functionCall.arguments,
      );

      console.log("parsedFunctionCallArguments", parsedFunctionCallArguments);

      const functionResponse = {
        messages: [
          ...chatMessages,
          {
            id: nanoid(),
            name: "save_setting",
            role: "function" as const,
            content: JSON.stringify(parsedFunctionCallArguments),
          },
        ],
      };
      return functionResponse;
    }
  }
};

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, data } = useChat({
    api: "/api/generate/world",
    initialMessages: [
      {
        id: "1",
        role: "system",
        content: `
**System Message: Welcome to the World Creation Assistant!**

I'm here to help you build the foundation for your unique and fantastical world. Let's start shaping the broad strokes of your setting. Please consider and answer the following questions to begin defining your world:

1. **Scope and Scale**: How vast is your world? Is it a single continent, a cluster of islands, or an entire galaxy?
2. **Basic Geography**: What are the main geographical features? Are there mountains, oceans, deserts, or forests?
3. **Climate Variations**: Does your world have diverse climates, or is it dominated by a single weather pattern?
4. **Day and Night Cycle**: How does the cycle of day and night work? Are there multiple suns or moons?
5. **Technology and Magic**: At a high level, is your world more inclined towards magic, technology, or a blend of both?
6. **Historical Context**: Does your world have a rich history, ancient civilizations, or is it relatively new and unexplored?
7. **Inhabitants**: What kind of beings might inhabit your world? Are they similar to humans, or entirely different?
8. **Overall Atmosphere**: What's the general feeling of your world? Is it a land of adventure, mystery, conflict, or peace?

As you answer these questions, we will build the basic framework of your world together. Feel free to be as detailed or as brief as you like. Your answers will guide our next steps in this creative journey!
        `,
      },
    ],
    experimental_onFunctionCall: functionCallHandler,
  });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col space-y-6 py-24">
      {messages.length > 0
        ? messages.map((m) => {
            if (
              !m.content &&
              m.function_call &&
              typeof m.function_call === "object" &&
              m.function_call.name === "save_setting" &&
              m.function_call.arguments
            ) {
              const parsedFunctionCallArguments: WorldSetting = JSON.parse(
                m.function_call.arguments,
              );
              console.log("Args from AI", parsedFunctionCallArguments);
              return (
                <div className="whitespace-pre-wrap text-green-950" key={m.id}>
                  <p>AI:</p>
                  <div className="bg-green-100 p-4 font-bold shadow-inner">
                    Saved World Setting!
                  </div>
                </div>
              );
            }

            // if (m.role === 'function') {
            //     return null;
            // }

            return (
              <div key={m.id} className={`${roleToColorMap[m.role]}`}>
                <p className="font-bold">
                  {m.role === "user" ? "User: " : "AI: "}
                </p>
                {m.role === "user" && <p>{m.content}</p>}
                {m.role === "function" && (
                  <div>
                    <span className="text-xs font-bold">
                      This is what will be passed to the save function. Printing
                      here for debugging purposes
                    </span>
                    <p className="whitespace-pre-wrap">
                      {JSON.stringify(JSON.parse(m.content), null, 2)}
                    </p>
                  </div>
                )}
                {["assistant", "system"].includes(m.role) && (
                  <Markdown className="prose-sm ">{m.content}</Markdown>
                )}
              </div>
            );
          })
        : null}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 mb-8 w-full max-w-md rounded border border-gray-300 p-2 shadow-xl"
          value={input}
          placeholder="Describe the world or setting..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
