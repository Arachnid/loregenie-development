'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import AlertDialog from '@/components/AlertDialog';
import { isEntry, LoreSchemas } from '@/types';

type Props<T extends LoreSchemas> = {
  data: T;
  setData: Dispatch<SetStateAction<T>>;
  permissions: string[];
  editMode: boolean;
};

const PageBody = <T extends LoreSchemas>({
  data,
  setData,
  permissions,
  editMode,
}: Props<T>) => {
  return (
    <>
      <input
        className='flex text-[40px] font-bold w-full placeholder:text-black/50 focus-visible:outline-none disabled:bg-white disabled:cursor-text'
        value={data.name}
        placeholder='Title'
        onChange={(e) => setData({ ...data, name: e.target.value })}
        disabled={!permissions.includes('writer') || !editMode}
      />
      {editMode ? (
        <div className='w-full'>
          <textarea
            className='w-full p-2'
            value={data.description}
            placeholder='Description'
            onChange={(e) => setData({ ...data, description: e.target.value })}
            rows={10}
          />
        </div>
      ) : (
        <ReactMarkdown className='markdown' children={data.description} />
      )}
    </>
  );
};

export default PageBody;
