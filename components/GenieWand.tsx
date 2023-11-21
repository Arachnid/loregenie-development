'use client';

import { aiGenerate } from '@/lib/ai';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

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
  const [simulateProcessing, setSimulateProcessing] = useState<boolean>(false);
  const [currentState, setCurrentState] = useState<CurrentState>(
    CurrentState.new
  );

  useEffect(() => {
    if (simulateProcessing) {
      const timer = setTimeout(() => {
        setCurrentState(CurrentState.complete);
        setSimulateProcessing(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [simulateProcessing]);

  // const generateNewResponse = async () => {
  //   if(inputPromptValue){
  //     await aiGenerate<Partial<Entry>>(
  //       entryData.category as string,
  //       {
  //         name: `Name for the ${category}`,
  //         imagePrompt: `A description of an image that captures the ${category}, written in a way that someone who has never heard of the ${category} could paint a picture`,
  //         description: DESCRIPTIONS[category]
  //       },
  //       [{name: worldData.name, description: worldData.description}],
  //       prompt
  //     )
  //   }
   
  
  // };

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
            setSimulateProcessing,
            inputPromptValue,
            setInputPromptValue
          )}
        </div>
      )}
    </>
  );
};

const closeButton = (
  setExpanded: Dispatch<SetStateAction<boolean>>,
  setCurrentState: Dispatch<SetStateAction<CurrentState>>,
  processing?: boolean
): JSX.Element => (
  <button
    className={`flex items-center justify-center gap-2 p-2.5 ${
      processing && 'md:px-4 md:py-2'
    } text-white border-2 border-white rounded-full`}
    onClick={() => {
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

const aiGenerateFunc = () => {
  // Your aiGenerate logic here
  console.log("AI Generate Called");
};


const newPrompt = (
  setExpanded: Dispatch<SetStateAction<boolean>>,
  setCurrentState: Dispatch<SetStateAction<CurrentState>>,
  setSimulateProcessing: Dispatch<SetStateAction<boolean>>,
  inputPromptValue: string,
  setInputPromptValue: Dispatch<SetStateAction<string>>
): JSX.Element => (
  <>
    {closeButton(setExpanded, setCurrentState)}
    {inputPromptField(inputPromptValue, setInputPromptValue)}
    {generateButton(setCurrentState, setSimulateProcessing, aiGenerateFunc )}
  </>
);

const editPrompt = (
  setCurrentState: Dispatch<SetStateAction<CurrentState>>,
  setSimulateProcessing: Dispatch<SetStateAction<boolean>>,
  inputPromptValue: string,
  setInputPromptValue: Dispatch<SetStateAction<string>>
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
    {generateButton(setCurrentState, setSimulateProcessing, aiGenerateFunc )}
  </>
);

const processingPrompt = (
  setExpanded: Dispatch<SetStateAction<boolean>>,
  setCurrentState: Dispatch<SetStateAction<CurrentState>>
): JSX.Element => (
  <>
    <div className='flex items-center justify-between w-full md:gap-6'>
      <div className='flex items-center gap-2'>
        <div className='flex items-center justify-center p-2 rounded-full bg-lore-blue-300'>
          <img className='animate-spin' src='/loading-icon.svg' alt='' />
        </div>
        <p className='font-medium text-white'>The Genie is thinking</p>
      </div>
      {closeButton(setExpanded, setCurrentState, true)}
    </div>
  </>
);

const completedPrompt = (
  setCurrentState: Dispatch<SetStateAction<CurrentState>>,
  setSimulateProcessing: Dispatch<SetStateAction<boolean>>,
  setExpanded: Dispatch<SetStateAction<boolean>>
): JSX.Element => (
  <>
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
      onClick={() => {
        setExpanded(false);
      }}
    >
      <span className='text-[20px] material-icons-outlined'>check_circle</span>
      <p>Done</p>
    </button>
  </>
);

const renderCurrentState = (
  currentState: CurrentState,
  setExpanded: Dispatch<SetStateAction<boolean>>,
  setCurrentState: Dispatch<SetStateAction<CurrentState>>,
  setSimulateProcessing: Dispatch<SetStateAction<boolean>>,
  inputPromptValue: string,
  setInputPromptValue: Dispatch<SetStateAction<string>>
): JSX.Element => {
  switch (currentState) {
    case CurrentState.new:
      return newPrompt(
        setExpanded,
        setCurrentState,
        setSimulateProcessing,
        inputPromptValue,
        setInputPromptValue
      );
    case CurrentState.edit:
      return editPrompt(
        setCurrentState,
        setSimulateProcessing,
        inputPromptValue,
        setInputPromptValue
      );
    case CurrentState.processing:
      return processingPrompt(setExpanded, setCurrentState);
    case CurrentState.complete:
      return completedPrompt(
        setCurrentState,
        setSimulateProcessing,
        setExpanded
      );
    default:
      return <></>;
  }
};

export default GenieWand;
