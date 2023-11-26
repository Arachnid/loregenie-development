"use client"

import Image from "next/image";
import { useState } from "react";
import useStore from '@/hooks/useStore';



const UserChat = ({ userDp, prompt }: any) => {
  const image = userDp || "/userprofile.png";
  console.log({userDp, image})
  return (
    <div className="flex flex-col gap-2 items-end mb-[15px]">
      <div className="flex items-center gap-[0.81rem]">
        <Image
          src={image}
          width={48}
          height={48}
          alt=""
          className="bg-black rounded-full"
        />
        <p className="text-xl leading-none font-semibold">You</p>
      </div>
      {/* <p className="text-[1.5rem] font-bold">{prompt}</p> */}
      <div className="px-[1.5rem] py-[1.5rem] rounded-lg text-base italic bg-[#4C7F8F1A] text-[0.9rem]">
        {prompt}
      </div>
    </div>
  );
};

const AiChat = ({ aiResults }: any) => {
  return (
    <div className="flex flex-col gap-[1.06rem] items-start mb-[15px]">
      <div className="flex items-center gap-[0.81rem] self-start">
        <Image
          src="/aiprofile.png"
          width={48}
          height={48}
          alt=""
          className="bg-black rounded-full"
        />
        <p className="text-xl leading-none font-semibold">AI</p>
      </div>
      <div className="px-[1.5rem] py-[1.5rem] rounded-lg text-base italic bg-[#4C7F8F1A] text-[0.9rem]">
        {aiResults}
      </div>
    </div>
  );
};

export default function ChatModal({ onClose, inputValue, onSubmit, user }: any) {

  const [expanded, setExpanded] = useState<boolean>(false);
  const [messages, setMessages] = useState<any>([{ role: 'assistant', content: 'Hi, how can I help you?' }]);
  const [input, setInput] = useState('');
  const store = useStore();
  const world = store.world;

  const renderMessage = (message: any, index: any) => {
    if (message.role === 'assistant') {
      return <AiChat key={index} aiResults={message.content} />;
    } else if (message.role === 'user') {
      return <UserChat key={index} prompt={message.content} userDp={user?.image}/>;
    }
  };


  const sendMessage = async () => {
    if (input.trim() !== '') {
      setMessages((messages: any) => [...messages, { role: 'user', content: input }]);
  
      // Add typing indication
      const typingTimeout = setTimeout(() => {
        setMessages((messages: any) => [...messages, { role: 'assistant', content: 'Typing...' }]);
      }, 1000);
  
      const response = await fetch('/api/openAi/startConversation', {
        method: 'POST',
        body: JSON.stringify({ world: world, message: input })
      });
      setInput('');
      // Clear the typing timeout upon receiving the response
      clearTimeout(typingTimeout);

      if (!response.ok) {
        throw new Error('Data fetching failed');
      }
      const result = await response.json();
  
      // Replace typing indication with actual response
      setMessages((messages: any) => {
        const updatedMessages = messages.slice(0, -1); // Remove the typing indication
        return [...updatedMessages, { role: 'assistant', content: result.assistant_response }];
      });
      
      
    }
  };

 
  
  

  return (
    <>
      {expanded && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-40"></div>
      )}

      <div className={`fixed inset-0 flex items-center justify-center z-50 ${expanded ? '' : 'hidden'}`}>
        <div className="chatbox flex flex-col justify-between rounded-[20px] pl-[45px] pr-[45px] max-w-[63%] w-full h-[90vh] bg-[#FFF] transition-all duration-300 ease-in-out">
        {/* ... chatbox content ... */}

        <div className=" header flex items-start ">
              <span className="navigate-back-Icon mt-[57px] cursor-pointer "
                onClick={()=>{setExpanded(false)}}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="52"
                  height="16"
                  viewBox="0 0 52 16"
                  fill="none"
                >
                <path
                  d="M0.292892 7.29289C-0.0976295 7.68342 -0.0976295 8.31658 0.292892 8.70711L6.65685 15.0711C7.04738 15.4616 7.68054 15.4616 8.07107 15.0711C8.46159 14.6805 8.46159 14.0474 8.07107 13.6569L2.41422 8L8.07107 2.34315C8.46159 1.95262 8.46159 1.31946 8.07107 0.928932C7.68054 0.538408 7.04738 0.538408 6.65685 0.928932L0.292892 7.29289ZM52 7L1 7V9L52 9V7Z"
                  fill="black"
                />
                </svg>
              </span>
            </div>


            <div className="chatview pt-[30px] pb-[10px] pl-[20px] pr-[20px] h-full w-full overflow-auto">
              
              {messages.map((msg :any, index: any) => renderMessage(msg, index))}

            </div>


            <div className="inputField flex flex-row w-full mb-[43px] mt-[5px] rounded-[50px] p-[5px] h-[55px] bg-[#4C7F8F]">
              
              <div className="inputFieldwrapper flex flex-row items-center justify-center w-full h-full mr-[19px] bg-[#FFF] rounded-[50px] p-[4px]">
                <span className="flex-grow-[1]">
                  <input type="text" name="" id="" className=" focus:outline-none rounded-[50px] flex w-full h-full pl-[20px] pr-[20px] outline-none pt-[10px] pb-[10px]"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  />
                </span>
                <span>
                  <button className="p-2 bg-[#4C7F8F] rounded-full"
                    onClick={sendMessage} 
                  >
                    <Image src="/send-2.svg" width={24} height={24} alt="" />
                  </button>
                </span>
              </div>

              <button
                    onClick={()=>{setExpanded(false)}}
                    type="button"
                    className="p-2 leading-none bg-[white] text-[#4C7F8F] rounded-[2rem] focus:outline-none w-[100px]"
                  >
                    X
              </button>

            </div>

        
        </div>
      </div>

      {!expanded && (
        <button
          className='fixed bottom-0 right-0 md:bottom-4 md:right-4 z-50 flex items-center justify-center gap-2 p-4 text-white rounded-tl-[30px] md:rounded-full bg-lore-blue-200'
          onClick={() => setExpanded(true)}
        >
          <span className='text-[28px] material-icons'>auto_fix_high</span>
        </button>
      )}
    
    </>
  );
}
