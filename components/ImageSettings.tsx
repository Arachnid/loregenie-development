'use client';

import { useOutsideClick } from '@/hooks/useOutsideClick';
import { LoreSchemas } from '@/types';
import { Dispatch, RefObject, SetStateAction, useRef } from 'react';

type Props<T extends LoreSchemas> = {
  showRemoveButton: boolean;
  data: T;
  setData: Dispatch<SetStateAction<T>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const ImageSettings = <T extends LoreSchemas>({
  showRemoveButton,
  data,
  setData,
  setOpen,
}: Props<T>) => {
  const uploadImageRef = useRef<HTMLInputElement>(null);
  const modalRef: RefObject<HTMLDivElement> = useOutsideClick<HTMLDivElement>(
    () => setOpen(false)
  );

  const handleUpload = () => {
    if (uploadImageRef.current) {
      uploadImageRef.current.click();
    }
  };

  return (
    <div
      className='absolute -translate-x-[200px] flex flex-col gap-2 p-2 bg-white rounded-lg border-lore-beige-500 border-2 w-[200px]'
      ref={modalRef}
    >
      <button
        className='flex items-center self-stretch justify-center gap-2 px-4 py-3 text-white transition-all duration-300 ease-out rounded-lg bg-lore-blue-400 hover:bg-lore-blue-500 disabled:hover:bg-lore-blue-400 disabled:opacity-50'
        disabled
      >
        <span className='text-[20px] material-icons'>auto_fix_high</span>
        <p className='font-medium leading-5'>Generate new</p>
      </button>
      <input
        type='file'
        ref={uploadImageRef}
        accept='image/*'
        onChange={(e) => {
          if (e.target.files) {
            setData({ ...data, image: URL.createObjectURL(e.target.files[0]) });
          }
          setOpen(false);
        }}
        hidden
      />
      <button
        className='flex items-center self-stretch justify-center gap-2 px-4 py-3 text-white transition-all duration-300 ease-out rounded-lg bg-lore-blue-400 hover:bg-lore-blue-500'
        onClick={() => handleUpload()}
      >
        <span className='text-[20px] material-icons'>add</span>
        <p className='font-medium leading-5'>Upload new</p>
      </button>
      {showRemoveButton && (
        <button
          className='flex items-center self-stretch justify-center gap-2 px-4 py-3 transition-all duration-300 ease-out bg-white border-2 rounded-lg text-lore-blue-400 border-lore-beige-500 h-11 hover:bg-lore-beige-400'
          onClick={() => {
            setData({ ...data, image: '' });
            setOpen(false);
          }}
        >
          <span className='text-[20px] material-icons'>close</span>
          <p className='font-medium leading-5'>Remove</p>
        </button>
      )}
    </div>
  );
};

export default ImageSettings;
