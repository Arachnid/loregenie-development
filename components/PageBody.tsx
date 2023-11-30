"use client";

import MarkdownEditor from "@/components/MarkdownEditor";
import { LoreSchemas } from "@/types";
import "@uiw/react-markdown-preview/markdown.css";
import "@uiw/react-md-editor/markdown-editor.css";
import { Dispatch, SetStateAction } from "react";
import Markdown from "react-markdown";

type Props<T extends LoreSchemas> = {
  data: T;
  setData: Dispatch<SetStateAction<T>>;
  permissions: string[];
};

const PageBody = <T extends LoreSchemas>({
  data,
  setData,
  permissions,
}: Props<T>) => {
  return (
    <div className="flex flex-col gap-4">
      <input
        className="flex w-full text-[40px] font-bold placeholder:text-black/50 focus-visible:outline-none disabled:cursor-text disabled:bg-white"
        value={data.name}
        placeholder="Title"
        onChange={(e) => setData({ ...data, name: e.target.value })}
        disabled={!permissions.includes("writer")}
      />
      {permissions.includes("writer") ? (
        <MarkdownEditor
          initialText={data.description}
          data={data}
          setData={setData}
        />
      ) : (
        <Markdown className="markdown" children={data.description} />
      )}
      <div className="flex h-[72px] w-full" />
    </div>
  );
};

export default PageBody;
