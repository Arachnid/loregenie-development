'use client';

import { Campaign, World } from '@/types';
import { Dispatch, SetStateAction } from 'react';
import PermissionDropDown from '@/components/PermissionDropDown';
import { Session } from 'next-auth';

type Props<T extends World | Campaign> = {
  email: string;
  title: string;
  data: T;
  setData: Dispatch<SetStateAction<T>>;
  session: Session;
};

const Contributor = <T extends World | Campaign>({
  email,
  title,
  data,
  setData,
  session,
}: Props<T>) => {
  return (
    <div className='flex items-center self-stretch gap-2'>
      <div className='flex items-center p-[10px] pr-4 gap-2 bg-white rounded-lg grow'>
        <img className='w-6 h-6 rounded-full' src='/no-profile-picture.svg' alt='' />
        <p className='leading-5 grow'>{email}</p>
      </div>
      {email === session.user?.email ? (
        <div className='flex flex-col w-[140px] text-lore-blue-400'>
          <button
            className='flex items-center gap-2 px-4 py-3 bg-white rounded-lg h-11'
            disabled
          >
            {title}
          </button>
        </div>
      ) : (
        <PermissionDropDown
          title={title}
          adminAction={() =>
            setData({
              ...data,
              admins: [...new Set([...data.admins, email])],
              writers: [...new Set([...data.writers, email])],
              readers: [...new Set([...data.readers, email])],
            })
          }
          writerAction={() =>
            setData({
              ...data,
              admins: data.admins.filter((admin) => email !== admin),
              writers: [...new Set([...data.writers, email])],
              readers: [...new Set([...data.readers, email])],
            })
          }
          readerAction={() =>
            setData({
              ...data,
              admins: data.admins.filter((admin) => email !== admin),
              writers: data.writers.filter((writer) => email !== writer),
              readers: [...new Set([...data.readers, email])],
            })
          }
        />
      )}
      {email === session.user?.email ? <div className='w-5 h-5' /> : <span
        className='text-[20px] material-icons text-lore-blue-400 cursor-pointer'
        onClick={() => {
          setData({
            ...data,
            admins: data.admins.filter((admin) => email !== admin),
            writers: data.writers.filter((writer) => email !== writer),
            readers: data.readers.filter((reader) => email !== reader),
          });
        }}
      >
        close
      </span>}
    </div>
  );
};

export default Contributor;
