import Image from "next/image";
import React from "react";

const UserChat = ({ userDp, prompt }) => {
  return (
    <div className="flex flex-col gap-2 items-end">
      <div className="flex items-center gap-[0.81rem]">
        <Image
          src="/userprofile.png"
          width={48}
          height={48}
          alt=""
          className="bg-black rounded-full"
        />
        <p className="text-xl leading-none font-semibold">You</p>
      </div>
      <p className="text-[2rem] font-bold">{prompt}</p>
    </div>
  );
};

const AiChat = ({ aiResults }) => {
  return (
    <div className="flex flex-col gap-[1.06rem] items-end">
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
      <div className="px-[1.5rem] py-[2.19rem] rounded-lg text-base italic bg-[#4C7F8F1A]">
        {aiResults}
      </div>
    </div>
  );
};

export default function ChatModal({ onClose, inputValue, onSubmit }) {
  return (
    <>
      <div className="">
        <div className="relative h-[90vh] max-w-[54rem] px-5 md:px-[2.81rem] bg-[#fff] rounded-[1.25rem] overflow-x-auto mx-4">
          <div
            onClick={onClose}
            className="sticky top-0 w-full md:pt-[3.56rem] py-4 md:pb-2 flex items-center bg-white"
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
          </div>
          <div className="flex flex-col gap-3 ">
            <UserChat userDp="" prompt="Background" />
            <AiChat
              aiResults="My customers always come first, and my profits always come second I owe
        a debt of gratitude to a mysterious benefactor who set me up in this
        line of work I am so paranoid of the law that I often over-react to
        perceived threats"
            />
            <UserChat userDp="" prompt="Appearance" />
            <AiChat
              aiResults="My customers always come first, and my profits always come second I owe
        a debt of gratitude to a mysterious benefactor who set me up in this
        line of work I am so paranoid of the law that I often over-react to
        perceived threats"
            />
          </div>
          <div className="sticky bottom-0 w-full p-2 mt-[5.19rem] bg-white md:pb-10 md:pt-5 pb-5 pt-3">
            <div className="px-3 py-2 flex items-center justify-between bg-[#4C7F8F] rounded-full gap-3">
              <div className="w-full sm:w-[36rem] flex justify-between bg-white rounded-full px-2 py-1">
                <input
                  type="text"
                  placeholder="Make it longer"
                  className="w-full sm:flex-grow rounded-full px-2 py-1 mr-2 border border-transparent focus:outline-none"
                  value={inputValue}
                />
                <button className="p-2 bg-[#4C7F8F] rounded-full">
                  <Image src="/send-2.svg" width={24} height={24} alt="" />
                </button>
              </div>

              <div className="flex items-center justify-center bg-[white] rounded-full px-4 py-1 w-[8.47919rem]">
                <Image src="/check.svg" width={20} height={20} alt="" />
                <button
                  onClick={onSubmit}
                  type="button"
                  className="p-2 leading-none bg-[white] text-[#4C7F8F] rounded-[2rem] focus:outline-none "
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
