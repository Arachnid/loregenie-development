'use client';

import { Dispatch, RefObject } from 'react';

type Props = {
  modalRef: RefObject<HTMLDivElement>;
  setShowModal: Dispatch<React.SetStateAction<boolean>>;
};

const SharingModal = ({ modalRef, setShowModal }: Props) => {
  return (
    <>
      <div
        className='z-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-lore-light-beige'
        ref={modalRef}
      >
        <div className='flex justify-center items-center py-4 px-6 gap-2 rounded-t-lg bg-lore-beige self-stretch'>
          <p className='font-medium text-2xl leading-7 grow'>
            Sharing settings
          </p>
          <span
            className='material-icons cursor-pointer'
            onClick={() => setShowModal(false)}
          >
            close
          </span>
        </div>
        <div className='flex flex-col p-6 gap-6 self-stretch'>
          <div className='flex gap-2 self-stretch'>
            <div className='flex justify-center items-center py-2 pr-2 pl-4 gap-2 bg-white rounded-lg grow'>
              <p className='leading-5 grow'>Make public</p>
            </div>
            <button className='flex justify-center items-center py-3 px-4 gap-2 bg-white border-2 border-lore-beige rounded-lg text-lore-blue'>
              <span className='text-[20px] material-icons'>link</span>
              <p className='font-medium leading-5'>Copy link</p>
            </button>
          </div>
          <div className='flex flex-col justify-center items-center gap-2 self-stretch'>
            <p className='font-medium text-2xl leading-7 self-stretch'>
              Contributors
            </p>
            <div className='flex gap-2 self-stretch'>
              <input
                className='flex justify-center items-center py-3 px-4 gap-2 bg-white rounded-lg grow focus-visible:outline-none placeholder:text-black placeholder:text-opacity-50'
                type='email'
                placeholder='Enter email'
              />
              <div className='flex justify-center items-center py-3 px-4 gap-2 bg-white rounded-lg text-lore-blue w-[140px]'>
                <p className='leading-5 grow'>Reader</p>
                <span className='text-[20px] material-icons'>expand_more</span>
              </div>
              <button className='flex justify-center items-center py-3 px-4 gap-2 bg-white border-2 border-lore-beige rounded-lg text-lore-blue'>
                <span className='text-[20px] material-icons'>add</span>
                <p className='font-medium leading-5'>Add</p>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='z-10 fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full' />
    </>
  );
};

export default SharingModal;
