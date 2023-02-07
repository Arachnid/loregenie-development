'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import AlertDialog from '@/components/AlertDialog';
import { LoreSchemas } from '@/types';

type Props<T extends LoreSchemas> = {
  data: T;
  setData: Dispatch<SetStateAction<T>>;
  permissions: string[];
  onDelete: () => Promise<void>;
};

const PageBody = <T extends LoreSchemas>({
  data,
  setData,
  permissions,
  onDelete,
}: Props<T>) => {
  const [editDescription, setEditDescription] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  return (
    <>
      <input
        className='flex text-[40px] font-bold w-full placeholder:text-black/50 focus-visible:outline-none disabled:bg-white disabled:cursor-text'
        value={data.name}
        placeholder='Title'
        onChange={(e) => setData({ ...data, name: e.target.value })}
        disabled={!permissions.includes('writer')}
      />
      {permissions.includes('writer') && (
        <button
          className='p-2 text-white rounded bg-lore-red-400'
          onClick={() => setEditDescription(!editDescription)}
        >
          {editDescription ? 'save description' : 'edit description'}
        </button>
      )}
      {editDescription ? (
        <textarea
          className='w-full h-full'
          value={data.description}
          placeholder='Description'
          onChange={(e) => setData({ ...data, description: e.target.value })}
        />
      ) : (
        <ReactMarkdown className='markdown' children={data.description} />
      )}
      {permissions.includes('admin') && (
        <button
          className='p-2 text-white rounded bg-lore-red-400'
          onClick={() => setAlertOpen(true)}
        >
          Delete Entry
        </button>
      )}
      {alertOpen && (
        <AlertDialog
          title={`Delete ${data.name}?`}
          alertOpen={alertOpen}
          setAlertOpen={setAlertOpen}
          action={onDelete}
        />
      )}
    </>
  );
};

export default PageBody;
