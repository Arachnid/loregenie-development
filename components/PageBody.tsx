'use client';

import { Dispatch, SetStateAction } from 'react';
import { LoreSchemas } from '@/types';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import MarkdownEditor from '@/components/MarkdownEditor';

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
    <div className='flex flex-col gap-4'>
      <input
        className='flex text-[40px] font-bold w-full placeholder:text-black/50 focus-visible:outline-none disabled:bg-white disabled:cursor-text'
        value={data.name}
        placeholder='Title'
        onChange={(e) => setData({ ...data, name: e.target.value })}
        disabled={!permissions.includes('writer')}
      />
      {permissions.includes('writer') ? (
        <MarkdownEditor
          initialText={data.description}
          data={data}
          setData={setData}
        />
      ) : (
        <ReactMarkdown className='markdown' children={data.description} />
      )}
      <div className='flex w-full h-[72px]' />
    </div>
  );
};

export default PageBody;
