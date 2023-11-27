'use client';

import { modifyResponse } from '@/lib/ai';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import useStore, { AssistanState } from '@/hooks/useStore';
import { ChatCompletionMessageParam } from 'openai/resources';
import { World } from '@/types';

//tracks the state of this component
enum CurrentState {
  new = 'new',
  edit = 'edit',
  processing = 'processing',
  complete = 'complete',
}

const GenieWand = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [inputPromptValue, setInputPromptValue] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false);
  const [currentState, setCurrentState] = useState<CurrentState>(
    CurrentState.new
  );

  const [messageHist, setMessageHist] = useState<Array<ChatCompletionMessageParam>>([]);
  const [abortController, setAbortController] = useState<AbortController| null>(null);
  const store = useStore();
  const worldId = store.world.id;

  useEffect(() => {
    if (!processing) {
        setCurrentState(CurrentState.complete);
    } else {
      setCurrentState(CurrentState.processing)
    }
  }, [processing]);

  useEffect(() => {
    async function fetchData() {
      try {

        const response = await fetch(`/api/files/readFiles?id=${worldId}`);
        if (!response.ok) {
          throw new Error('Data fetching failed');
        }
        const result = await response.json();
        setMessageHist(result);
       

      } catch (error) {
        console.error('Error:', error);
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

      const response = await fetch('/api/openAi/gpt4', {
        method: 'POST',
        body: JSON.stringify({
          prompt: inputPromptValue,
          messages: messageHist,
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error('Data fetching failed');
      }
      const result = await response.json();

      //update chat state with response
      store.setAssistantResponse(result.response);
      store.saveToLocalStorage(worldId, result.response)
      localStorage.setItem('assistantResponse', JSON.stringify(result.response));
      console.log({ass: store.assistantResponse })

     //update assistant file

      const update_response = await fetch('/api/files/writeFiles', {
        method: 'POST',
        body: JSON.stringify({
          id: worldId,
          airesponse: result.response,
          messages: result.messages,
        }),
      });

      if (!update_response.ok) {
        throw new Error('updating file failed');
      }
      const updated = await update_response.json();
      

      setProcessing(false);
     


      } catch (error: any) {
        setProcessing(false);
      }
     
    } catch (error) {
      console.error('Error generating response:', error);
    }
  };

  const updateWorldPage = async (  ) => {
    try {
      const updatedWorld : Partial<World>= store.world;
      updatedWorld.description = store.assistantResponse.description;
      updatedWorld.name = store.assistantResponse.name;
      updatedWorld.imagePrompt = store.assistantResponse.imagePrompt;

      const response = await fetch('/api/world/update', {
        method: 'POST',
        body: JSON.stringify({
          worldData: updatedWorld,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update world');
      }
      const updatedWrld = await response.json();
      store.setWorld(updatedWrld);

    } catch (error: any) {
      console.log({error, msg: error.message})
    }
  }

  const cancelFetch = () => {
    if (abortController) {
      abortController.abort();
    }
  };
  useEffect(() => {
    console.log({assres: store.assistantResponse})
  },[store.assistantResponse])


  return (
    <>
      {!expanded && (
        <button
          className='absolute bottom-0 right-0 md:bottom-4 md:right-4 z-20 flex items-center justify-center gap-2 p-4 text-white rounded-tl-[30px] md:rounded-full bg-lore-blue-200'
          onClick={() => {
            setExpanded(true);
            setCurrentState(CurrentState.new);
          }}
        >
          <span className='text-[28px] material-icons'>auto_fix_high</span>
        </button>
      )}
      {expanded && (
        <div className='absolute bottom-0 right-0 z-20 flex items-center justify-between w-full gap-2 p-2 md:w-auto md:rounded-full md:bottom-4 md:right-4 bg-lore-blue-200'>
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
      processing && 'md:px-4 md:py-2'
    } text-white border-2 border-white rounded-full`}
    onClick={() => {
      if(processing){
        cancelFetch();
      }
      setExpanded(false);
      setCurrentState(CurrentState.new);
    }}
  >
    <span className='text-[20px] material-icons'>close</span>
    {processing && <p className='hidden font-medium md:flex'>Stop</p>}
  </button>
);

const generateButton = (
  setCurrentState: Dispatch<SetStateAction<CurrentState>>,
  setSimulateProcessing: Dispatch<SetStateAction<boolean>>,
  onGenerate: () => void 
): JSX.Element => (
  <button
    className='flex items-center justify-center gap-2 p-3 bg-white rounded-full md:px-4 md:py-2.5 text-lore-blue-200'
    onClick={() => {
      setCurrentState(CurrentState.processing);
      setSimulateProcessing(true);
      onGenerate();
    }}
  >
    <span className='text-[20px] material-icons'>auto_fix_high</span>
    <p className='hidden font-medium md:flex'>Generate</p>
  </button>
);

const inputPromptField = (
  inputPromptValue: string,
  setInputPromptValue: Dispatch<SetStateAction<string>>
): JSX.Element => (
  <input
    className='flex items-center justify-center gap-2 px-4 py-2.5 bg-white rounded-full grow focus-visible:outline-none placeholder:font-cinzel md:min-w-[21rem] md:w-full'
    type='text'
    placeholder='PROMPT ENTRY'
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
  handleGenerateClick: ()=>void,
  cancelFetch: () => void,
  store?: AssistanState,
): JSX.Element => (
  <>
    {closeButton(setExpanded, setCurrentState, cancelFetch )}
    {inputPromptField(inputPromptValue, setInputPromptValue)}
    {generateButton(setCurrentState, setSimulateProcessing, handleGenerateClick )}
  </>
);

const editPrompt = (
  setCurrentState: Dispatch<SetStateAction<CurrentState>>,
  setSimulateProcessing: Dispatch<SetStateAction<boolean>>,
  inputPromptValue: string,
  setInputPromptValue: Dispatch<SetStateAction<string>>,
  handleGenerateClick: () => void ,
  store?: AssistanState
): JSX.Element => (
  <>
    <button
      className='flex justify-center items-center p-2.5 gap-2 rounded-full border-2 border-white text-white'
      onClick={() => {
        setCurrentState(CurrentState.complete);
      }}
    >
      <span className='text-[20px] material-icons'>arrow_back</span>
    </button>
    {inputPromptField(inputPromptValue, setInputPromptValue)}
    {generateButton(setCurrentState, setSimulateProcessing, handleGenerateClick  )}
  </>
);

const processingPrompt = (
  setExpanded: Dispatch<SetStateAction<boolean>>,
  setCurrentState: Dispatch<SetStateAction<CurrentState>>,
  cancelFetch: () => void,
): JSX.Element => (
  <>
    <div className='flex items-center justify-between w-full md:gap-6'>
      <div className='flex items-center gap-2'>
        <div className='flex items-center justify-center p-2 rounded-full bg-lore-blue-300'>
          <img className='animate-spin' src='/loading-icon.svg' alt='' />
        </div>
        <p className='font-medium text-white'>The Genie is thinking</p>
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
  updateWorldPage: () => void
): JSX.Element => {

  const setEditableResponse = (e: any) => {
    store.setAssistantResponse({...store.assistantResponse, description: e});
  }

  return (
  <>

    <div className='flex flex-col gap-2 p-4 bg-white rounded-md shadow-lg absolute bottom-[72px] w-[60vw] right-0'>
        <textarea
          className='w-full h-40 p-2 text-gray-800 border rounded-md focus:outline-none focus:ring-2 focus:ring-lore-blue-300'
          value={store.assistantResponse.description}
          onChange={(e) => setEditableResponse(e.target.value)}
        />
      </div>

      <button
        className='flex items-center justify-center gap-2 px-4 py-2 font-medium text-white border-2 border-white rounded-full bg-lore-blue-200 grow md:px-8'
        onClick={() => {
          setCurrentState(CurrentState.edit);
        }}
      >
        <span className='text-[20px] material-icons-outlined'>edit</span>
        <p>Edit</p>
      </button>
      <button
        className='flex items-center justify-center gap-2 px-4 py-2 font-medium text-white border-2 border-white rounded-full bg-lore-blue-200 grow md:px-8'
        onClick={() => {
          setCurrentState(CurrentState.processing);
          setSimulateProcessing(true);
        }}
      >
        <span className='text-[20px] material-icons'>auto_fix_high</span>
        <p>Reroll</p>
      </button>
      <button
        className='flex items-center justify-center gap-2 px-4 py-2.5 font-medium bg-white rounded-full grow text-lore-blue-200 md:px-8'
        onClick={async () => {
          //call api db and update world
          await updateWorldPage()
          setExpanded(false);
        }}
      >
        <span className='text-[20px] material-icons-outlined'>check_circle</span>
        <p>Done</p>
      </button>

  </>
)};

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
  cancelFetch: () => void
  
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
        store
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
        updateWorldPage
      );
    default:
      return <></>;
  }
};

export default GenieWand;
