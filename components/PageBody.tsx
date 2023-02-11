'use client';

import { Dispatch, SetStateAction } from 'react';
import { LoreSchemas } from '@/types';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

type Props<T extends LoreSchemas> = {
  data: T;
  setData: Dispatch<SetStateAction<T>>;
  permissions: string[];
};

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const PageBody = <T extends LoreSchemas>({
  data,
  setData,
  permissions,
}: Props<T>) => {
  return (
    <>
      <input
        className='flex text-[40px] font-bold w-full placeholder:text-black/50 focus-visible:outline-none disabled:bg-white disabled:cursor-text'
        value={data.name}
        placeholder='Title'
        onChange={(e) => setData({ ...data, name: e.target.value })}
        disabled={!permissions.includes('writer')}
      />
      {permissions.includes('writer') ? (
        <div className='w-full h-full'>
          <MDEditor
            data-color-mode='light'
            className='w-full'
            value={data.description}
            onChange={(desc) => setData({ ...data, description: desc })}
          />
        </div>
      ) : (
        <ReactMarkdown className='markdown' children={data.description} />
      )}
    </>
  );
};

export default PageBody;
