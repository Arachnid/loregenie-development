"use client";

import { isSaveEntryFunctionData } from "@/ai/functions/saveEntries";
import { isSaveWorldFunctionData } from "@/ai/functions/saveWorld";
import { SaveFunctionDataResponse } from "@/app/api/assistant/route";
import { createEntry } from "@/server/actions/entry";
import { createWorld } from "@/server/actions/world";
import { useBlockNote } from "@blocknote/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Message, experimental_useAssistant as useAssistant } from "ai/react";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";

const roleToColorMap: Record<Message["role"], string> = {
  system: "red",
  user: "black",
  function: "blue",
  assistant: "green",
  data: "orange",
};

type EntryRecord = Record<string, string>;

export default function Chat() {
  const [assistantId, setAssistantId] = useState<string>("");
  const [threadId, setThreadId] = useState<string>("");
  const [worldID, setWorldID] = useState<string>("");
  const [campaignID, setCampaignID] = useState<string>("");
  const [entryRecords, setEntryRecords] = useState<EntryRecord>({});
  const [toolCallId, setToolCallId] = useState<string>("");
  const [functionResponse, setFunctionResponse] =
    useState<SaveFunctionDataResponse["functionResponse"]>();

  const queryClient = useQueryClient();

  const editor = useBlockNote();

  const { mutate: createWorldMutation, isPending } = useMutation({
    mutationFn: createWorld,
    onSuccess: (data) => {
      if (data.data) {
        setWorldID(data.data.id);
        void queryClient.invalidateQueries({ queryKey: ["worlds"] });
      }
    },
  });

  const { mutate: createEntryMutation } = useMutation({
    mutationFn: createEntry,
    onSuccess: (data) => {
      if (data.entry) {
        setEntryRecords((prev) => {
          if (data.entry) {
            return {
              ...prev,
              [data.entry.name]: data.entry.id,
            };
          } else {
            return prev;
          }
        });
      }
    },
  });

  const { status, messages, input, submitMessage, handleInputChange, error } =
    useAssistant({
      api: "/api/assistant",
      body: {
        assistantId,
        worldID,
        campaignID,
      },
    });

  // When status changes to accepting messages, focus the input:
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (status === "awaiting_message") {
      inputRef.current?.focus();
    }
  }, [status]);

  useEffect(() => {
    const lastData = messages.findLast((m) => m.role === "data");
    if (lastData) {
      const data = lastData.data as SaveFunctionDataResponse;

      if (data.meta.assistantId) {
        setAssistantId(data.meta.assistantId);
      }
      if (data.meta.threadId) {
        setThreadId(data.meta.threadId);
      }
      if (data.meta.worldID) {
        setWorldID(data.meta.worldID);
      }
      if (data.meta.campaignID) {
        setCampaignID(data.meta.campaignID);
      }
      if (data.meta.toolCallId) {
        setToolCallId(data.meta.toolCallId);
      }
      if (data.functionResponse) {
        setFunctionResponse(data.functionResponse);
      }
    }
  }, [messages]);

  useEffect(() => {
    async function save() {
      if (editor && functionResponse && toolCallId) {
        if (isSaveWorldFunctionData(functionResponse)) {
          const blocks = await editor.tryParseMarkdownToBlocks(
            functionResponse.content,
          );
          createWorldMutation({
            assistantId,
            threadId,
            name: functionResponse.name,
            description: JSON.stringify(blocks),
          });
        } else if (isSaveEntryFunctionData(functionResponse)) {
          for (const entry of functionResponse.entries) {
            const blocks = await editor.tryParseMarkdownToBlocks(entry.content);
            const parentKey = Object.keys(entryRecords).find((key) => {
              if (entry.parentEntry) {
                return key
                  .toLowerCase()
                  .includes(entry.parentEntry.toLowerCase());
              } else {
                return false;
              }
            });
            console.log(entry);
            const entryID = parentKey ? entryRecords[parentKey] : undefined;

            createEntryMutation(
              {
                worldID,
                campaignID,
                entryID,
                name: entry.name,
                category: entry.category,
                description: JSON.stringify(blocks),
              },
              {
                onSuccess: (data) => {
                  if (data.entry) {
                    void queryClient.invalidateQueries({
                      queryKey: ["worlds"],
                    });
                  }
                },
              },
            );
          }
        }
      }
    }
    void save();
  }, [toolCallId, functionResponse]);

  const inputIsDisabled = status !== "awaiting_message" || isPending;

  return (
    <div className="stretch mx-auto flex w-full max-w-screen-2xl flex-col py-24">
      {error != null && (
        <div className="relative rounded-md bg-red-500 px-6 py-4 text-white">
          <span className="block sm:inline">
            Error: {(error as any).toString()}
          </span>
        </div>
      )}

      {messages.length === 0 && (
        <div
          className="whitespace-pre-wrap"
          style={{ color: roleToColorMap["system"] }}
        >
          <strong>{`system: `}</strong>
          Welcome to your world! Start describing the world you want to make or
          ask a question to get started.
          <br />
          <br />
        </div>
      )}
      {messages.map((m: Message) => {
        if (m.role === "data") {
          return null;
        }
        return (
          <div
            key={m.id}
            className="whitespace-pre-wrap"
            style={{ color: roleToColorMap[m.role] }}
          >
            <strong>{`${m.role}: `}</strong>
            <Markdown className="prose-sm *:*:*:m-0 *:*:m-0 *:m-0">
              {m.content}
            </Markdown>
            <br />
            <br />
          </div>
        );
      })}

      {status === "in_progress" && (
        <div className="mb-8 h-8 w-full max-w-md animate-pulse rounded-lg bg-gray-300 p-2 dark:bg-gray-600" />
      )}

      <form onSubmit={submitMessage}>
        <input
          ref={inputRef}
          disabled={inputIsDisabled}
          className="fixed bottom-0 mb-8 w-full max-w-lg rounded border border-gray-300 p-2 shadow-xl"
          value={input}
          placeholder="Let's build your world! Start chatting..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
