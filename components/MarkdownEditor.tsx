import { css } from "@emotion/css";
import Prism from "prismjs";
import "prismjs/components/prism-markdown";
import { SetStateAction, useCallback, useMemo } from "react";
import { BaseEditor, createEditor, Descendant, Node, Text } from "slate";
import { withHistory } from "slate-history";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";

const serialize = (value: Descendant[]) => {
  return value.map((n) => Node.string(n)).join("\n");
};

const deserialize = (string: string) => {
  return string.split("\n").map((line) => {
    return {
      children: [{ text: line }],
    };
  });
};

type CustomElement = { type: "paragraph"; children: CustomText[] };
type CustomText = { text: string };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

interface Props<T extends {}> {
  initialText: string;
  data: T;
  setData: (value: SetStateAction<T>) => void;
}

const MarkdownEditor = <T extends {}>({
  initialText,
  data,
  setData,
}: Props<T>) => {
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const initialValue = useMemo(() => deserialize(initialText || ""), []);
  const decorate = useCallback(([node, path]: any): any => {
    const ranges: any = [];

    if (!Text.isText(node)) {
      return ranges;
    }

    const getLength = (token: any) => {
      if (typeof token === "string") {
        return token.length;
      } else if (typeof token.content === "string") {
        return token.content.length;
      } else {
        return token.content.reduce((l: any, t: any) => l + getLength(t), 0);
      }
    };

    const tokens = Prism.tokenize(node.text, Prism.languages.markdown);
    let start = 0;

    for (const token of tokens) {
      const length = getLength(token);
      const end = start + length;

      if (typeof token !== "string") {
        ranges.push({
          [token.type]: true,
          anchor: { path, offset: start },
          focus: { path, offset: end },
        });
      }

      start = end;
    }

    return ranges;
  }, []);

  return (
    <Slate
      editor={editor}
      value={initialValue as Descendant[]}
      onChange={(value) => {
        const isAstChange = editor.operations.some(
          (op) => "set_selection" !== op.type,
        );
        if (isAstChange) {
          setData({ ...data, description: serialize(value) });
        }
      }}
    >
      <Editable
        decorate={decorate}
        renderLeaf={renderLeaf}
        placeholder="Description"
      />
    </Slate>
  );
};

const Leaf = ({ attributes, children, leaf }: any) => {
  return (
    <span
      {...attributes}
      className={css`
        font-weight: ${leaf.bold && "bold"};
        font-style: ${leaf.italic && "italic"};
        text-decoration: ${leaf.underlined && "underline"};
        ${leaf.title &&
        css`
          display: inline-block;
          font-weight: bold;
          font-size: 20px;
          margin: 20px 0 10px 0;
        `}
        ${leaf.list &&
        css`
          padding-left: 10px;
          font-size: 20px;
          line-height: 10px;
        `}
        ${leaf.hr &&
        css`
          display: block;
          text-align: center;
          border-bottom: 2px solid #ddd;
        `}
        ${leaf.blockquote &&
        css`
          display: inline-block;
          border-left: 2px solid #ddd;
          padding-left: 10px;
          color: #aaa;
          font-style: italic;
        `}
        ${leaf.code &&
        css`
          font-family: monospace;
          background-color: #eee;
          padding: 3px;
        `}
      `}
    >
      {children}
    </span>
  );
};

export default MarkdownEditor;
