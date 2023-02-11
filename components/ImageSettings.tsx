'use client';

import { LoreSchemas } from '@/types';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

type Props<T extends LoreSchemas> = {
  data: T;
  setData: Dispatch<SetStateAction<T>>;
  permissions: string[];
};

const ImageSettings = <T extends LoreSchemas>({
  data,
  setData,
  permissions,
}: Props<T>) => {
  const [editImage, setEditImage] = useState(false);

  const uploadImageRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    if (uploadImageRef.current) {
      uploadImageRef.current.click();
    }
  };

  return (
    <OutsideClickHandler
      onOutsideClick={() => setEditImage(false)}
      display='contents'
    >
      {editImage && (
        <div className='absolute -translate-x-[200px] flex flex-col gap-2 p-2 bg-white rounded-lg border-lore-beige-500 border-2 w-[200px]'>
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
                setData({
                  ...data,
                  image: URL.createObjectURL(e.target.files[0]),
                });
              }
              setEditImage(false);
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
          {data.image && (
            <button
              className='flex items-center self-stretch justify-center gap-2 px-4 py-3 transition-all duration-300 ease-out bg-white border-2 rounded-lg text-lore-blue-400 border-lore-beige-500 h-11 hover:bg-lore-beige-400'
              onClick={() => {
                setData({ ...data, image: '' });
                setEditImage(false);
              }}
            >
              <span className='text-[20px] material-icons'>close</span>
              <p className='font-medium leading-5'>Remove</p>
            </button>
          )}
        </div>
      )}
      {permissions.includes('writer') && (
        <button
          className='flex items-center justify-center gap-2 p-3 transition-all duration-300 ease-out rounded-full w-11 h-11 bg-lore-red-400 hover:bg-lore-red-500'
          onClick={() => setEditImage(!editImage)}
        >
          <span className='text-[20px] text-white material-icons'>
            more_vert
          </span>
        </button>
      )}
    </OutsideClickHandler>
  );
};

export default ImageSettings;
