'use client';

import { useEffect, useState } from 'react';

const GenieWand = () => {
  const [expanded, setExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [simulateProcessing, setSimulateProcessing] = useState(false);

  const closeButton = (
    <button
      className='flex items-center justify-center gap-2 p-2.5 text-white border-2 border-white rounded-full'
      onClick={() => {
        setExpanded(false);
        setActiveState(newPrompt);
      }}
    >
      <span className='text-[20px] material-icons'>close</span>
    </button>
  );

  const generateButton = (
    <button
      className='flex items-center justify-center gap-2 p-3 bg-white rounded-full'
      onClick={() => {
        setActiveState(processing);
        setSimulateProcessing(true);
      }}
    >
      <span className='text-[20px] material-icons text-lore-blue-200'>
        auto_fix_high
      </span>
    </button>
  );

  const inputField = (
    <input
      className='flex items-center justify-center gap-2 px-4 py-2.5 bg-white rounded-full grow focus-visible:outline-none placeholder:font-cinzel'
      type='text'
      placeholder='PROMPT ENTRY'
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
    />
  );

  const newPrompt = (
    <>
      {closeButton}
      {inputField}
      {generateButton}
    </>
  );

  const editPrompt = (
    <>
      <button
        className='flex justify-center items-center p-2.5 gap-2 rounded-full border-2 border-white text-white'
        onClick={() => {
          setActiveState(completed);
        }}
      >
        <span className='text-[20px] material-icons'>arrow_back</span>
      </button>
      {inputField}
      {generateButton}
    </>
  );

  const processing = (
    <>
      <div className='flex items-center gap-2'>
        <div className='flex items-center justify-center gap-2 p-2 rounded-full bg-lore-blue-300'>
          <img className='animate-spin' src='/loading-icon.svg' alt='' />
        </div>
        <p className='font-medium text-white'>The Genie is thinking</p>
      </div>
      {closeButton}
    </>
  );

  const completed = (
    <>
      <button
        className='flex items-center justify-center gap-2 px-4 py-2 font-medium text-white border-2 border-white rounded-full bg-lore-blue-200 grow'
        onClick={() => {
          setActiveState(editPrompt);
        }}
      >
        <span className='text-[20px] material-icons-outlined'>edit</span>
        <p>Edit</p>
      </button>
      <button
        className='flex items-center justify-center gap-2 px-4 py-2 font-medium text-white border-2 border-white rounded-full bg-lore-blue-200 grow'
        onClick={() => {
          setActiveState(processing);
          setSimulateProcessing(true);
        }}
      >
        <span className='text-[20px] material-icons'>auto_fix_high</span>
        <p>Reroll</p>
      </button>
      <button
        className='flex items-center justify-center gap-2 px-4 py-2.5 font-medium bg-white rounded-full grow text-lore-blue-200'
        onClick={() => {
          setExpanded(false);
        }}
      >
        <span className='text-[20px] material-icons-outlined'>
          check_circle
        </span>
        <p>Done</p>
      </button>
    </>
  );

  const [activeState, setActiveState] = useState<JSX.Element>(newPrompt);

  useEffect(() => {
    if (simulateProcessing) {
      const timer = setTimeout(() => {
        setActiveState(completed);
        setSimulateProcessing(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [simulateProcessing]);

  return (
    <>
      {!expanded && (
        <button
          className='absolute bottom-0 right-0 md:bottom-4 md:right-4 z-20 flex items-center justify-center gap-2 p-4 text-white rounded-tl-[30px] md:rounded-full bg-lore-blue-200'
          onClick={() => {
            setExpanded(true);
            setActiveState(newPrompt);
          }}
        >
          <span className='text-[28px] material-icons'>auto_fix_high</span>
        </button>
      )}
      {expanded && (
        <div className='absolute bottom-0 right-0 z-20 flex items-center justify-between w-full gap-2 p-2 md:bottom-4 md:right-4 bg-lore-blue-200'>
          {activeState}
        </div>
      )}
    </>
  );
};

export default GenieWand;
