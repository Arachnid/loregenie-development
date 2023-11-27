'use client';

import { LoreSchemas, World } from '@/types';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import useStore from '@/hooks/useStore';

type Props<T extends LoreSchemas> = {
  data: T;
  setData: Dispatch<SetStateAction<T>>;
  permissions: string[];
  onUpload: (uploadedFile: File) => Promise<void>;
  onDelete: () => Promise<void>;
};

const ImageSettings = <T extends LoreSchemas>({
  data,
  setData,
  permissions,
  onUpload,
  onDelete,
}: Props<T>) => {
  const [editImage, setEditImage] = useState(false);  
  const [processing, setProcessing] = useState<boolean>(false);

  const uploadImageRef = useRef<HTMLInputElement>(null);
  const store = useStore();

  const handleUpload = () => {
    if (uploadImageRef.current) {
      uploadImageRef.current.click();
    }
  };

  const generateNewImage = async () => {
      try {
        console.log({promptimg: data.imagePrompt})
        setProcessing(true);
        const response = await fetch('/api/openAi/generateImage', {
          method: 'POST',
          body: JSON.stringify({ prompt: data.imagePrompt, size: '1792x1024' })
        });

        if (!response.ok) {
          throw new Error('Data fetching failed');
        }
        const result = await response.json();
        setProcessing(false);
        
        data.image = result;

        store.setWorld({...store.world, image: result});
       
        console.log({result})
      } catch (error: any) {
        setProcessing(false)
        console.log(error.message)
      }
  }

  return (
    <OutsideClickHandler
      onOutsideClick={() => setEditImage(false)}
      display='contents'
    >
      {editImage && (
        <div className='absolute -translate-x-[200px] flex flex-col gap-2 p-2 bg-white rounded-lg border-lore-beige-500 border-2 w-[200px]'>
          <button
            className='flex items-center self-stretch justify-center gap-2 px-4 py-3 text-white transition-all duration-300 ease-out rounded-lg bg-lore-blue-400 hover:bg-lore-blue-500 disabled:hover:bg-lore-blue-400 disabled:opacity-50'
            // {data.imagePrompt && 'disabled': ''}}
            onClick={()=>{generateNewImage()}}
          > {
            !processing ? (
            <>
              <span className='text-[20px] material-icons'>auto_fix_high</span>
              <p className='font-medium leading-5'>Generate new</p>
            </>
            ):(
              <p className='font-medium leading-5'>Generating... </p>
            )
          }
            
            
          </button>
          <input
            type='file'
            ref={uploadImageRef}
            accept='image/png, image/jpeg'
            onChange={(e) => {
              if (e.target.files) {
                onUpload(e.target.files[0]);
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
                onDelete();
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
