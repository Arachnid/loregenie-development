"use client";

import useStore from "@/hooks/useStore";
import Image from "next/image";
import { useState } from "react";

const UserChat = ({ userDp, prompt }: any) => {
  const image = userDp || "/userprofile.png";
  console.log({ userDp, image });
  return (
    <div className="mb-[15px] flex flex-col items-end gap-2">
      <div className="flex items-center gap-[0.81rem]">
        <Image
          src={image}
          width={48}
          height={48}
          alt=""
          className="rounded-full bg-black"
        />
        <p className="text-xl font-semibold leading-none">You</p>
      </div>
      {/* <p className="text-[1.5rem] font-bold">{prompt}</p> */}
      <div className="rounded-lg bg-[#4C7F8F1A] px-[1.5rem] py-[1.5rem] text-base text-[0.9rem] italic">
        {prompt}
      </div>
    </div>
  );
};

const AiChat = ({ aiResults }: any) => {
  return (
    <div className="mb-[15px] flex flex-col items-start gap-[1.06rem]">
      <div className="flex items-center gap-[0.81rem] self-start">
        <Image
          src="/aiprofile.png"
          width={48}
          height={48}
          alt=""
          className="rounded-full bg-black"
        />
        <p className="text-xl font-semibold leading-none">AI</p>
      </div>
      <div className="rounded-lg bg-[#4C7F8F1A] px-[1.5rem] py-[1.5rem] text-base text-[0.9rem] italic">
        {aiResults}
      </div>
    </div>
  );
};

export default function ChatModal({
  onClose,
  inputValue,
  onSubmit,
  user,
}: any) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [messages, setMessages] = useState<any>([
    { role: "assistant", content: "Hi, how can I help you?" },
  ]);
  const [input, setInput] = useState("");
  const store = useStore();
  const world = store.world;

  const renderMessage = (message: any, index: any) => {
    if (message.role === "assistant") {
      return <AiChat key={index} aiResults={message.content} />;
    } else if (message.role === "user") {
      return (
        <UserChat key={index} prompt={message.content} userDp={user?.image} />
      );
    }
  };

  function analyzeResponse(response: any) {
    try {
      const obj =
        typeof response === "string" ? JSON.parse(response) : response;
      if (
        obj &&
        typeof obj === "object" &&
        "name" in obj &&
        "description" in obj &&
        "imagePrompt" in obj
      ) {
        world.description = obj?.description;
        world.name = obj?.name;
        world.imagePrompt = obj?.imagePrompt;
        store.setWorld(world);
        return "Your page has been updated";
      }
      return response;
    } catch (error) {
      // If JSON.parse() fails, it's a plain string
      return response;
    }
  }

  const sendMessage = async () => {
    const userInput = input;
    setInput("");
    if (input.trim() !== "") {
      setMessages((messages: any) => [
        ...messages,
        { role: "user", content: userInput },
      ]);

      // Add typing indication
      const typingTimeout = setTimeout(() => {
        setMessages((messages: any) => [
          ...messages,
          { role: "assistant", content: "Typing..." },
        ]);
      }, 1000);

      const response = await fetch("/api/openAi/startConversation", {
        method: "POST",
        body: JSON.stringify({ world: world, message: userInput }),
      });

      // Clear the typing timeout upon receiving the response
      clearTimeout(typingTimeout);

      if (!response.ok) {
        throw new Error("Data fetching failed");
      }
      const result = await response.json();

      // if response is a json object store object in session.
      const updateMessage = analyzeResponse(result.assistant_response);
      // set update message to updated

      // Replace typing indication with actual response
      setMessages((messages: any) => {
        const updatedMessages = messages.slice(0, -1); // Remove the typing indication
        return [
          ...updatedMessages,
          { role: "assistant", content: updateMessage },
        ];
      });

      setInput("");
    }
  };

  return (
    <>
      {expanded && (
        <div className="fixed inset-0 z-40 bg-white/30 backdrop-blur-sm"></div>
      )}

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          expanded ? "" : "hidden"
        }`}
      >
        <div className="chatbox flex h-[90vh] w-full max-w-[63%] flex-col justify-between rounded-[20px] bg-[#FFF] pl-[45px] pr-[45px] transition-all duration-300 ease-in-out">
          {/* ... chatbox content ... */}

          <div className=" header flex items-start ">
            <span
              className="navigate-back-Icon mt-[57px] cursor-pointer "
              onClick={() => {
                setExpanded(false);
              }}
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

          <div className="chatview h-full w-full overflow-auto pt-[30px] pb-[10px] pl-[20px] pr-[20px]">
            {messages.map((msg: any, index: any) => renderMessage(msg, index))}
          </div>

          <div className="inputField mb-[43px] mt-[5px] flex h-[55px] w-full flex-row rounded-[50px] bg-[#4C7F8F] p-[5px]">
            <div className="inputFieldwrapper mr-[19px] flex h-full w-full flex-row items-center justify-center rounded-[50px] bg-[#FFF] p-[4px]">
              <span className="flex-grow-[1]">
                <input
                  type="text"
                  name=""
                  id=""
                  className=" flex h-full w-full rounded-[50px] pl-[20px] pr-[20px] pt-[10px] pb-[10px] outline-none focus:outline-none"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
              </span>
              <span>
                <button
                  className="rounded-full bg-[#4C7F8F] p-2"
                  onClick={sendMessage}
                >
                  <Image src="/send-2.svg" width={24} height={24} alt="" />
                </button>
              </span>
            </div>

            <button
              onClick={() => {
                setExpanded(false);
              }}
              type="button"
              className="w-[100px] rounded-[2rem] bg-[white] p-2 leading-none text-[#4C7F8F] focus:outline-none"
            >
              X
            </button>
          </div>
        </div>
      </div>

      {!expanded && (
        <button
          className="fixed bottom-0 right-0 z-50 flex items-center justify-center gap-2 rounded-tl-[30px] bg-lore-blue-200 p-4 text-white md:bottom-4 md:right-4 md:rounded-full"
          onClick={() => setExpanded(true)}
        >
          <span className="material-icons text-[28px]">auto_fix_high</span>
        </button>
      )}
    </>
  );
}
