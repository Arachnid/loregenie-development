"use client";

import { BlockNoteEditor } from "@blocknote/core";
import "@blocknote/core/style.css";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import { useTheme } from "next-themes";
import { useEffect } from "react";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();

  let content: any = undefined;

  try {
    if (initialContent) {
      content = JSON.parse(initialContent);
    }
  } catch (e) {}

  const editor: BlockNoteEditor = useBlockNote({
    editable,
    initialContent: content,
    onEditorContentChange: (editor) => {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
    },
  });
  useEffect(() => {
    async function getBlocks() {
      if (editor && content) {
        const blocks = await editor.tryParseMarkdownToBlocks(content);
        editor.replaceBlocks(editor.topLevelBlocks, blocks);
      }
      getBlocks();
    }
  }, [content, editor]);

  return (
    <div>
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  );
};

export default Editor;
