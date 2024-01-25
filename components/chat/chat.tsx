"use client";

import { isSaveEntryFunctionData } from "@/ai/functions/saveEntries";
import { isSaveWorldFunctionData } from "@/ai/functions/saveWorld";
import { SaveFunctionDataResponse } from "@/app/api/assistant/route";
import { AssistantMessage } from "@/components/chat/assistant-message";
import { LoadingBar } from "@/components/chat/loading-bar";
import { SystemMessage } from "@/components/chat/system-message";
import { UserMessage } from "@/components/chat/user-message";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createEntry } from "@/server/actions/entry";
import {
  createWorld,
  getWorld,
  getWorldThreadMessages,
} from "@/server/actions/world";
import { isString } from "@/utils/typeGuards";
import { useBlockNote } from "@blocknote/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Message, experimental_useAssistant as useAssistant } from "ai/react";
import { MessageSquareText } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const roleToColorMap: Record<Message["role"], string> = {
  system: "red",
  user: "black",
  function: "blue",
  assistant: "green",
  data: "orange",
  tool: "purple",
};

type EntryRecord = Record<string, string>;

export default function Chat() {
  const params = useParams<{
    worldID: string;
    campaignID: string;
    entryID: string;
  }>();

  const worldIDParam = params?.worldID;

  const { data, isLoading } = useQuery({
    queryKey: ["worlds", worldIDParam],
    queryFn: async () => {
      return await getWorld(isString(params?.worldID) ? params.worldID : "");
    },
    enabled: !!worldIDParam,
  });

  const [showHistory, setShowHistory] = useState<boolean>(false);

  const [assistantId, setAssistantId] = useState<string>("");
  const [threadId, setThreadId] = useState<string>("");
  const [worldID, setWorldID] = useState<string>(worldIDParam || "");
  const [campaignID, setCampaignID] = useState<string>("");
  const [entryRecords, setEntryRecords] = useState<EntryRecord>({});
  const [toolCallId, setToolCallId] = useState<string>("");
  const [functionResponse, setFunctionResponse] =
    useState<SaveFunctionDataResponse["functionResponse"]>();

  const queryClient = useQueryClient();
  const world = data?.data;

  const { data: threadsData, isLoading: isLoadingThreads } = useQuery({
    queryKey: ["threads", world?.threadId],
    queryFn: async () => {
      return await getWorldThreadMessages(world?.id ?? "");
    },
    enabled: !!world?.threadId,
    refetchOnWindowFocus: false,
  });

  const threads = threadsData?.data;

  useEffect(() => {
    if (world) {
      setAssistantId(world.assistantId ?? "");
      setThreadId(world.threadId ?? "");
      setEntryRecords(
        world.entries.reduce((acc: EntryRecord, entry) => {
          acc[entry.name] = entry.id;
          return acc;
        }, {}),
      );
    }
  }, [world]);

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

  const {
    threadId: assistantThreadId,
    status,
    messages,
    input,
    submitMessage,
    handleInputChange,
    error,
  } = useAssistant({
    api: "/api/assistant",
    threadId,
    body: {
      assistantId,
      worldID,
      campaignID,
      threadId,
    },
  });

  useEffect(() => {
    if (assistantThreadId) {
      setThreadId(assistantThreadId);
    }
  }, [assistantThreadId]);

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

  let systemMessage =
    "Let's make a new world! Start describing the world you want to make and I'll help you build it.";

  if (worldIDParam) {
    systemMessage =
      "Welcome back! Let's continue building your world. Start describing the next entry you want to make and I'll help you build it.";
  }

  return (
    <div
      className={cn(
        "stretch z-10 mx-auto flex min-h-dvh w-full flex-col p-10 py-24 ",
        "bg-blue-50/30",
        " dark:bg-lore-blue-700/70",
      )}
    >
      {error != null && (
        <div className="relative rounded-md bg-red-500 px-6 py-4 text-white">
          <span className="block sm:inline">
            Error: {(error as any).toString()}
          </span>
        </div>
      )}

      {worldIDParam &&
        (isLoading || isLoadingThreads ? (
          <LoadingBar />
        ) : (
          <>
            {showHistory ? (
              <>
                {threads?.map((m) => {
                  if (m.role === "assistant") {
                    return m.content.map((c, i) => {
                      if (c.type === "text") {
                        return (
                          <AssistantMessage
                            message={c.text.value}
                            key={`${m.id}-${i}`}
                          />
                        );
                      }
                    });
                  }
                  if (m.role === "user") {
                    return m.content.map((c, i) => {
                      if (c.type === "text") {
                        return (
                          <UserMessage
                            message={c.text.value}
                            key={`${m.id}-${i}`}
                          />
                        );
                      }
                    });
                  }

                  return null;
                })}
              </>
            ) : (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowHistory(true);
                }}
                className="mb-6 space-x-3"
                variant="outline"
              >
                <MessageSquareText />
                <span>Show History</span>
              </Button>
            )}
          </>
        ))}

      {messages.length === 0 && <SystemMessage message={systemMessage} />}
      {messages.map((m: Message, i) => {
        if (m.role === "system") {
          return <SystemMessage message={m.content} key={i} />;
        }
        if (m.role === "assistant") {
          return <AssistantMessage message={m.content} key={i} />;
        }
        if (m.role === "user") {
          return <UserMessage message={m.content} key={i} />;
        }

        return null;
      })}

      {status === "in_progress" && <LoadingBar />}

      <form onSubmit={submitMessage}>
        <input
          ref={inputRef}
          disabled={inputIsDisabled}
          className="fixed bottom-0 mb-8 w-full max-w-64 rounded border border-gray-300 p-2 shadow-xl sm:max-w-[500px] lg:max-w-screen-md"
          value={input}
          placeholder="Let's build your world! Start chatting..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
