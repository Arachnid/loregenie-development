'use client';

import { Dispatch, RefObject, useState } from 'react';

type Props = {
  modalRef: RefObject<HTMLDivElement>;
  setShowModal: Dispatch<React.SetStateAction<boolean>>;
};

const SharingModal = ({ modalRef, setShowModal }: Props) => {
  const [publicSwitchOn, setPublicSwitchOn] = useState(false);

  return (
    <>
      <div
        className='absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-lg top-1/2 left-1/2 bg-lore-beige-400'
        ref={modalRef}
      >
        <div className='flex items-center self-stretch justify-center gap-2 px-6 py-4 rounded-t-lg bg-lore-beige-500'>
          <p className='text-2xl font-medium leading-7 grow'>
            Sharing settings
          </p>
          <span
            className='cursor-pointer material-icons'
            onClick={() => setShowModal(false)}
          >
            close
          </span>
        </div>
        <div className='flex flex-col self-stretch gap-6 p-6'>
          <div className='flex self-stretch gap-2'>
            <div className='flex items-center justify-center gap-2 py-2 pl-4 pr-2 bg-white rounded-lg grow'>
              <p className='leading-5 grow'>Make public</p>
              <button
                className={`flex items-center ${
                  publicSwitchOn && 'justify-end'
                } w-12 gap-2 p-[2px] border-2 rounded-full h-7 border-lore-beige-500`}
                onClick={() => setPublicSwitchOn(!publicSwitchOn)}
              >
                <div
                  className={`w-5 h-5 rounded-full ${
                    publicSwitchOn ? 'bg-lore-blue-400' : 'bg-lore-gray-100'
                  }`}
                />
              </button>
            </div>
            <button className='flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 rounded-lg border-lore-beige-500 text-lore-blue-400'>
              <span className='text-[20px] material-icons'>link</span>
              <p className='font-medium leading-5'>Copy link</p>
            </button>
          </div>
          <div className='flex flex-col items-center self-stretch justify-center gap-2'>
            <p className='self-stretch text-2xl font-medium leading-7'>
              Contributors
            </p>
            <div className='flex self-stretch gap-2'>
              <input
                className='flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-lg grow focus-visible:outline-none placeholder:text-black placeholder:text-opacity-50'
                type='email'
                placeholder='Enter email'
              />
              <div className='flex justify-center items-center py-3 px-4 gap-2 bg-white rounded-lg text-lore-blue-400 w-[140px]'>
                <p className='leading-5 grow'>Reader</p>
                <span className='text-[20px] material-icons'>expand_more</span>
              </div>
              <button className='flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 rounded-lg border-lore-beige-500 text-lore-blue-400'>
                <span className='text-[20px] material-icons'>add</span>
                <p className='font-medium leading-5'>Add</p>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='fixed inset-0 z-10 w-full h-full overflow-y-auto bg-gray-600 bg-opacity-50' />
    </>
  );
};

export default SharingModal;
