'use client';

import { Campaign, isEntry, LoreSchemas, User, World } from '@/types';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Contributor from '@/components/Contributor';
import PermissionDropDown from '@/components/dropdown/PermissionDropDown';
import OutsideClickHandler from 'react-outside-click-handler';
import { Session } from 'next-auth';

type Props<T extends LoreSchemas> = {
  setShowModal: Dispatch<React.SetStateAction<boolean>>;
  data: T;
  setData: Dispatch<SetStateAction<T>>;
  session: Session;
};

const SharingModal = <T extends LoreSchemas>({
  setShowModal,
  data,
  setData,
  session,
}: Props<T>) => {
  const [publicSwitchOn, setPublicSwitchOn] = useState<boolean>(data.public);
  const [inputEmail, setInputEmail] = useState<string>('');
  const [inputPermission, setInputPermission] = useState<string>('Reader');
  const [users, setUsers] = useState<User[]>([]);

  const getUsers = async (emails: string[]) => {
    try {
      let result: User[] = [];
      await fetch('/api/user/get', {
        method: 'POST',
        body: JSON.stringify({ emails }),
      }).then((res) =>
        res.json().then((users: User[]) => {
          result = users;
        })
      );
      return result;
    } catch (error) {
      console.log('error fetching users: ', error);
    }
  };

  useEffect(() => {
    if (!isEntry(data) && data.readers.length) {
      const setUserData = async () => {
        const users = await getUsers(data.readers) as User[];
        setUsers(users);
      }
      setUserData();
    }
  }, [!isEntry(data) && data.readers]);

  const onAdd = async () => {
    const validUser = await getUsers([inputEmail]);
    if (!validUser?.length) {
      return alert('User with that email does not exist.');
    }
    if (!isEntry(data)) {
      switch (inputPermission) {
        case 'Admin':
          setData({
            ...data,
            admins: [...new Set([...data.admins, inputEmail])],
            writers: [...new Set([...data.writers, inputEmail])],
            readers: [...new Set([...data.readers, inputEmail])],
          });
          break;
        case 'Writer':
          setData({
            ...data,
            writers: [...new Set([...data.writers, inputEmail])],
            readers: [...new Set([...data.readers, inputEmail])],
          });
          break;
        case 'Reader':
          setData({
            ...data,
            readers: [...new Set([...data.readers, inputEmail])],
          });
          break;
        default:
          break;
      }
    }
    setInputEmail('');
  };

  return (
    <>
      <OutsideClickHandler
        onOutsideClick={() => setShowModal(false)}
        display='contents'
      >
        <div className='absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-lg top-1/2 left-1/2 bg-lore-beige-400 w-[97%] min-w-max md:w-[571px]'>
          <div className='flex items-center self-stretch justify-center gap-2 px-6 py-4 rounded-t-lg bg-lore-beige-500'>
            <p className='text-2xl font-medium leading-7 grow'>
              {isEntry(data) ? 'Visibility' : 'Sharing settings'}
            </p>
            <span
              className='cursor-pointer material-icons'
              onClick={() => setShowModal(false)}
            >
              close
            </span>
          </div>
          <div className='flex flex-col self-stretch gap-6 p-6'>
            <div className='flex flex-col self-stretch gap-2 md:flex-row'>
              <div className='flex items-center justify-center gap-2 py-2 pl-4 pr-2 bg-white rounded-lg grow'>
                <p className='leading-5 grow'>Make public</p>
                <button
                  className={`flex items-center ${
                    publicSwitchOn && 'justify-end'
                  } w-12 gap-2 p-[2px] border-2 rounded-full h-7 border-lore-beige-500`}
                  onClick={() => {
                    setData({ ...data, public: !data.public });
                    setPublicSwitchOn(!publicSwitchOn);
                  }}
                >
                  <div
                    className={`w-5 h-5 rounded-full ${
                      publicSwitchOn ? 'bg-lore-blue-400' : 'bg-lore-gray-100'
                    }`}
                  />
                </button>
              </div>
              <button
                className='flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 rounded-lg border-lore-beige-500 text-lore-blue-400'
                onClick={() =>
                  navigator.clipboard
                    .writeText(window.location.href)
                    .then(() => alert('link copied!'))
                }
              >
                <span className='text-[20px] material-icons'>link</span>
                <p className='font-medium leading-5'>Copy link</p>
              </button>
            </div>
            {!isEntry(data) && (
              <div className='flex flex-col items-center self-stretch justify-center gap-2'>
                <p className='self-stretch text-2xl font-medium leading-7'>
                  Contributors
                </p>
                {users.map((contributor, index) => {
                  if (data.admins.includes(contributor.email)) {
                    return (
                      <Contributor<World | Campaign>
                        key={index}
                        email={contributor.email}
                        image={contributor.image}
                        title='Admin'
                        data={data}
                        setData={
                          setData as Dispatch<SetStateAction<World | Campaign>>
                        }
                        session={session}
                      />
                    );
                  } else if (data.writers.includes(contributor.email)) {
                    return (
                      <Contributor<World | Campaign>
                        key={index}
                        email={contributor.email}
                        image={contributor.image}
                        title='Writer'
                        data={data}
                        setData={
                          setData as Dispatch<SetStateAction<World | Campaign>>
                        }
                        session={session}
                      />
                    );
                  } else {
                    return (
                      <Contributor<World | Campaign>
                        key={index}
                        email={contributor.email}
                        image={contributor.image}
                        title='Reader'
                        data={data}
                        setData={
                          setData as Dispatch<SetStateAction<World | Campaign>>
                        }
                        session={session}
                      />
                    );
                  }
                })}
                <div className='flex flex-col self-stretch gap-2 md:flex-row'>
                  <input
                    className='flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-lg h-11 grow focus-visible:outline-none placeholder:text-black placeholder:text-opacity-50'
                    type='email'
                    placeholder='Enter email'
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                  />
                  <div className='flex gap-2'>
                  <PermissionDropDown
                    title={inputPermission}
                    adminAction={() => setInputPermission('Admin')}
                    writerAction={() => setInputPermission('Writer')}
                    readerAction={() => setInputPermission('Reader')}
                  />
                  <button
                    className='flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 rounded-lg h-11 border-lore-beige-500 text-lore-blue-400'
                    onClick={() => onAdd()}
                  >
                    <span className='text-[20px] material-icons'>add</span>
                    <p className='font-medium leading-5'>Add</p>
                  </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </OutsideClickHandler>
      <div className='fixed inset-0 z-10 w-full h-full overflow-y-auto bg-gray-600 bg-opacity-50' />
    </>
  );
};

export default SharingModal;
