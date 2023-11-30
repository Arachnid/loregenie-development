"use client";

import useStore, { AssistanState } from "@/hooks/useStore";
import { World } from "@/types";
import { ChatCompletionMessageParam } from "openai/resources";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  MdArrowBack,
  MdAutoFixHigh,
  MdClose,
  MdOutlineCheckCircle,
  MdOutlineEdit,
} from "react-icons/md";

//tracks the state of this component
enum CurrentState {
  new = "new",
  edit = "edit",
  processing = "processing",
  complete = "complete",
}

const GenieWand = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [inputPromptValue, setInputPromptValue] = useState<string>("");
  const [processing, setProcessing] = useState<boolean>(false);
  const [currentState, setCurrentState] = useState<CurrentState>(
    CurrentState.new,
  );

  const [messageHist, setMessageHist] = useState<
    Array<ChatCompletionMessageParam>
  >([]);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);
  const store = useStore();
  const worldId = store.world.id;

  useEffect(() => {
    if (!processing) {
      setCurrentState(CurrentState.complete);
    } else {
      setCurrentState(CurrentState.processing);
    }
  }, [processing]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/files/readFiles?id=${worldId}`);
        if (!response.ok) {
          throw new Error("Data fetching failed");
        }
        const result = await response.json();
        setMessageHist(result);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    if (worldId) {
      fetchData();
    }
  }, [worldId]);

  const handleGenerateClick = async () => {
    try {
      setProcessing(true);
      try {
        const controller = new AbortController();
        setAbortController(controller);

        const response = await fetch("/api/openAi/gpt4", {
          method: "POST",
          body: JSON.stringify({
            prompt: inputPromptValue,
            messages: messageHist,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Data fetching failed");
        }
        const result = await response.json();

        //update chat state with response
        store.setAssistantResponse(result.response);
        store.saveToLocalStorage(worldId, result.response);
        localStorage.setItem(
          "assistantResponse",
          JSON.stringify(result.response),
        );
        console.log({ ass: store.assistantResponse });

        //update assistant file

        const update_response = await fetch("/api/files/writeFiles", {
          method: "POST",
          body: JSON.stringify({
            id: worldId,
            airesponse: result.response,
            messages: result.messages,
          }),
        });

        if (!update_response.ok) {
          throw new Error("updating file failed");
        }
        const updated = await update_response.json();

        setProcessing(false);
      } catch (error: any) {
        setProcessing(false);
      }
    } catch (error) {
      console.error("Error generating response:", error);
    }
  };

  const updateWorldPage = async () => {
    try {
      const updatedWorld: Partial<World> = store.world;
      updatedWorld.description = store.assistantResponse.description;
      updatedWorld.name = store.assistantResponse.name;
      updatedWorld.imagePrompt = store.assistantResponse.imagePrompt;

      const response = await fetch("/api/world/update", {
        method: "POST",
        body: JSON.stringify({
          worldData: updatedWorld,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update world");
      }
      const updatedWrld = await response.json();
      store.setWorld(updatedWrld);
    } catch (error: any) {
      console.log({ error, msg: error.message });
    }
  };

  const cancelFetch = () => {
    if (abortController) {
      abortController.abort();
    }
  };
  useEffect(() => {
    console.log({ assres: store.assistantResponse });
  }, [store.assistantResponse]);

  return (
    <>
      {!expanded && (
        <button
          className="absolute bottom-0 right-0 z-20 flex items-center justify-center gap-2 rounded-tl-[30px] bg-lore-blue-200 p-4 text-white md:bottom-4 md:right-4 md:rounded-full"
          onClick={() => {
            setExpanded(true);
            setCurrentState(CurrentState.new);
          }}
        >
          <MdAutoFixHigh className="h-7 w-7" />
        </button>
      )}
      {expanded && (
        <div className="absolute bottom-0 right-0 z-20 flex w-full items-center justify-between gap-2 bg-lore-blue-200 p-2 md:bottom-4 md:right-4 md:w-auto md:rounded-full">
          {renderCurrentState(
            currentState,
            setExpanded,
            setCurrentState,
            setProcessing,
            inputPromptValue,
            setInputPromptValue,
            handleGenerateClick,
            store,
            updateWorldPage,
            cancelFetch,
          )}
        </div>
      )}
    </>
  );
};

const closeButton = (
  setExpanded: Dispatch<SetStateAction<boolean>>,
  setCurrentState: Dispatch<SetStateAction<CurrentState>>,
  cancelFetch: () => void,
  processing?: boolean,
): JSX.Element => (
  <button
    className={`flex items-center justify-center gap-2 p-2.5 ${
      processing && "md:px-4 md:py-2"
    } rounded-full border-2 border-white text-white`}
    onClick={() => {
      if (processing) {
        cancelFetch();
      }
      setExpanded(false);
      setCurrentState(CurrentState.new);
    }}
  >
    <MdClose className="h-5 w-5" />
    {processing && <p className="hidden font-medium md:flex">Stop</p>}
  </button>
);

const generateButton = (
  setCurrentState: Dispatch<SetStateAction<CurrentState>>,
  setSimulateProcessing: Dispatch<SetStateAction<boolean>>,
  onGenerate: () => void,
): JSX.Element => (
  <button
    className="flex items-center justify-center gap-2 rounded-full bg-white p-3 text-lore-blue-200 md:px-4 md:py-2.5"
    onClick={() => {
      setCurrentState(CurrentState.processing);
      setSimulateProcessing(true);
      onGenerate();
    }}
  >
    <MdAutoFixHigh className="h-5 w-5" />
    <p className="hidden font-medium md:flex">Generate</p>
  </button>
);

const inputPromptField = (
  inputPromptValue: string,
  setInputPromptValue: Dispatch<SetStateAction<string>>,
): JSX.Element => (
  <input
    className="flex grow items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 placeholder:font-cinzel focus-visible:outline-none md:w-full md:min-w-[21rem]"
    type="text"
    placeholder="PROMPT ENTRY"
    value={inputPromptValue}
    onChange={(e) => setInputPromptValue(e.target.value)}
  />
);

const newPrompt = (
  setExpanded: Dispatch<SetStateAction<boolean>>,
  setCurrentState: Dispatch<SetStateAction<CurrentState>>,
  setSimulateProcessing: Dispatch<SetStateAction<boolean>>,
  inputPromptValue: string,
  setInputPromptValue: Dispatch<SetStateAction<string>>,
  handleGenerateClick: () => void,
  cancelFetch: () => void,
  store?: AssistanState,
): JSX.Element => (
  <>
    {closeButton(setExpanded, setCurrentState, cancelFetch)}
    {inputPromptField(inputPromptValue, setInputPromptValue)}
    {generateButton(
      setCurrentState,
      setSimulateProcessing,
      handleGenerateClick,
    )}
  </>
);

const editPrompt = (
  setCurrentState: Dispatch<SetStateAction<CurrentState>>,
  setSimulateProcessing: Dispatch<SetStateAction<boolean>>,
  inputPromptValue: string,
  setInputPromptValue: Dispatch<SetStateAction<string>>,
  handleGenerateClick: () => void,
  store?: AssistanState,
): JSX.Element => (
  <>
    <button
      className="flex items-center justify-center gap-2 rounded-full border-2 border-white p-2.5 text-white"
      onClick={() => {
        setCurrentState(CurrentState.complete);
      }}
    >
      <MdArrowBack className="h-5 w-5" />
    </button>
    {inputPromptField(inputPromptValue, setInputPromptValue)}
    {generateButton(
      setCurrentState,
      setSimulateProcessing,
      handleGenerateClick,
    )}
  </>
);

const processingPrompt = (
  setExpanded: Dispatch<SetStateAction<boolean>>,
  setCurrentState: Dispatch<SetStateAction<CurrentState>>,
  cancelFetch: () => void,
): JSX.Element => (
  <>
    <div className="flex w-full items-center justify-between md:gap-6">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center rounded-full bg-lore-blue-300 p-2">
          <img className="animate-spin" src="/loading-icon.svg" alt="" />
        </div>
        <p className="font-medium text-white">The Genie is thinking</p>
      </div>
      {closeButton(setExpanded, setCurrentState, cancelFetch, true)}
    </div>
  </>
);

const completedPrompt = (
  setCurrentState: Dispatch<SetStateAction<CurrentState>>,
  setSimulateProcessing: Dispatch<SetStateAction<boolean>>,
  setExpanded: Dispatch<SetStateAction<boolean>>,
  store: AssistanState,
  updateWorldPage: () => void,
): JSX.Element => {
  const setEditableResponse = (e: any) => {
    store.setAssistantResponse({ ...store.assistantResponse, description: e });
  };

  return (
    <>
      <div className="absolute bottom-[72px] right-0 flex w-[60vw] flex-col gap-2 rounded-md bg-white p-4 shadow-lg">
        <textarea
          className="h-40 w-full rounded-md border p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-lore-blue-300"
          value={store.assistantResponse.description}
          onChange={(e) => setEditableResponse(e.target.value)}
        />
      </div>

      <button
        className="flex grow items-center justify-center gap-2 rounded-full border-2 border-white bg-lore-blue-200 px-4 py-2 font-medium text-white md:px-8"
        onClick={() => {
          setCurrentState(CurrentState.edit);
        }}
      >
        <MdOutlineEdit className="h-5 w-5" />
        <p>Edit</p>
      </button>
      <button
        className="flex grow items-center justify-center gap-2 rounded-full border-2 border-white bg-lore-blue-200 px-4 py-2 font-medium text-white md:px-8"
        onClick={() => {
          setCurrentState(CurrentState.processing);
          setSimulateProcessing(true);
        }}
      >
        <MdAutoFixHigh className="h-5 w-5" />
        <p>Reroll</p>
      </button>
      <button
        className="flex grow items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 font-medium text-lore-blue-200 md:px-8"
        onClick={async () => {
          //call api db and update world
          await updateWorldPage();
          setExpanded(false);
        }}
      >
        <MdOutlineCheckCircle className="h-5 w-5" />
        <p>Done</p>
      </button>
    </>
  );
};

const renderCurrentState = (
  currentState: CurrentState,
  setExpanded: Dispatch<SetStateAction<boolean>>,
  setCurrentState: Dispatch<SetStateAction<CurrentState>>,
  setSimulateProcessing: Dispatch<SetStateAction<boolean>>,
  inputPromptValue: string,
  setInputPromptValue: Dispatch<SetStateAction<string>>,
  handleGenerateClick: () => void,
  store: AssistanState,
  updateWorldPage: () => void,
  cancelFetch: () => void,
): JSX.Element => {
  switch (currentState) {
    case CurrentState.new:
      return newPrompt(
        setExpanded,
        setCurrentState,
        setSimulateProcessing,
        inputPromptValue,
        setInputPromptValue,
        handleGenerateClick,
        cancelFetch,
        store,
      );
    case CurrentState.edit:
      return editPrompt(
        setCurrentState,
        setSimulateProcessing,
        inputPromptValue,
        setInputPromptValue,
        handleGenerateClick,
      );
    case CurrentState.processing:
      return processingPrompt(setExpanded, setCurrentState, cancelFetch);
    case CurrentState.complete:
      return completedPrompt(
        setCurrentState,
        setSimulateProcessing,
        setExpanded,
        store,
        updateWorldPage,
      );
    default:
      return <></>;
  }
};

export default GenieWand;
