"use client";

// Import necessary hooks and components
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { MdAdd, MdAutoFixHigh, MdAutorenew } from "react-icons/md";

type Props = {
  onCreate: (prompt?: string) => Promise<void>;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  children?: JSX.Element;
  disabled: boolean;
};

const GenieForm = ({ onCreate, setOpen, children, disabled }: Props) => {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true); // Set loading to true when the button is clicked
      await onCreate(prompt);
    } finally {
      setLoading(false); // Set loading back to false after the operation is complete (success or failure)
    }
  };

  return (
    <div className="relative flex w-full min-w-max flex-col gap-4 pt-20 md:w-[640px] md:gap-10">
      <div className="relative isolate flex flex-col gap-4 self-stretch rounded-2xl bg-lore-beige-400 p-4 md:gap-8 md:p-10">
        <img
          className="absolute left-[calc(50%-320px/2)] top-[-166px] w-[320px] md:-right-8 md:left-auto md:top-[calc(50%-524px/2-56px)] md:h-[524px] md:w-[389px]"
          src="/genie.svg"
          alt=""
        />
        <div className="z-20 flex flex-col gap-4 self-stretch rounded-2xl">
          {children}
          <input
            className="flex items-center justify-center gap-4 self-stretch rounded-[10px] bg-white px-5 py-3 text-center font-cinzel text-[27px] font-semibold leading-9 focus-visible:outline-none"
            placeholder="PROMPT EXAMPLE"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            className="flex items-center justify-center gap-2 self-stretch rounded-lg bg-lore-red-400 px-4 py-3 text-white transition-all duration-300 ease-out hover:bg-lore-red-500 disabled:opacity-50 disabled:hover:bg-lore-red-400"
            disabled={prompt.length === 0 || disabled || loading}
            onClick={handleGenerate}
          >
            {loading ? (
              <>
                <MdAutorenew className="h-5 w-5 animate-spin" />
                <p className="ml-2 font-medium leading-5">
                  Genie is thinking...
                </p>
              </>
            ) : (
              <>
                <MdAutoFixHigh className="h-5 w-5" />
                <p className="font-medium leading-5">
                  {children ? "Generate" : "Generate world"}
                </p>
              </>
            )}
          </button>
        </div>
        <div className="absolute bottom-[-80px] left-0 flex w-full gap-2 p-4 text-lore-blue-400 md:bottom-[-100px] md:gap-6 md:px-10">
          <button
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-lore-beige-500 bg-white px-3 py-3 transition-all duration-300 ease-out hover:bg-lore-beige-400 md:px-4"
            onClick={setOpen ? () => setOpen(false) : () => router.back()}
          >
            <p className="font-medium leading-5">Cancel</p>
          </button>
          <button
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-lore-beige-500 bg-white px-4 py-3 transition-all duration-300 ease-out hover:bg-lore-beige-400 disabled:bg-white/50"
            onClick={() => onCreate()}
            disabled={disabled}
          >
            <MdAdd className="h-5 w-5" />
            <p className="font-medium leading-5">Create blank</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenieForm;
