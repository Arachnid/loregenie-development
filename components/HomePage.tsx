'use client';

import { World } from '@/types';
import GenieForm from '@/components/GenieForm';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { signIn } from 'next-auth/react';

type Props = {
  worlds: World[];
  session: Session | null;
};

const HomePage = ({ worlds, session }: Props) => {
  const [genieFormOpen, setGenieFormOpen] = useState(false);

  const router = useRouter();

  const blankWorld = {
    name: '',
    description: '',
    image: '',
    readers: [session?.user?.email],
    writers: [session?.user?.email],
    admins: [session?.user?.email],
    public: false,
    entries: [],
    campaigns: [],
  };

  const onCreate = async () => {
    try {
      await fetch('/api/world/create', {
        method: 'POST',
        body: JSON.stringify(blankWorld),
      }).then((res) =>
        res.json().then((worldID: string) => {
          router.push(`/world/${worldID}`);
          router.refresh();
        })
      );
    } catch (error) {
      console.log('error submitting world: ', error);
    }
  };

  return (
    <>
      <div className='flex flex-col h-full overflow-y-scroll scrollbar-hide bg-lore-beige-100'>
        <img
          className='fixed object-cover w-full h-full translate-y-80 mix-blend-multiply'
          src='/background.svg'
          alt=''
        />
        <div className='z-10 flex flex-col items-center gap-6 py-12'>
          {worlds.map((world, index) => (
            <div
              className='flex flex-col justify-end gap-4 p-10 cursor-pointer rounded-2xl w-[860px] h-[400px] bg-lore-beige-500 bg-cover 
              bg-[linear-gradient(180deg,rgba(0,0,0,0)0%,rgba(0,0,0,0.75)100%),url("/eryndor.svg")]'
              onClick={() => router.push(`/world/${world.id}`)}
              key={index}
            >
              <div className='flex items-end justify-between gap-20'>
                <div className='flex flex-col w-full gap-2 text-white'>
                  <p className='flex font-cinzel font-medium text-[40px] leading-[54px] text-center'>
                    {world.name ? world.name.toUpperCase() : 'UNTITLED'}
                  </p>
                  <p className='text-lg font-light leading-5'>
                    {world.description}
                  </p>
                </div>
                <div className='grid grid-flow-col grid-rows-2 gap-2'>
                  {world.contributors.map((contributor, index) => (
                    <div className='w-12 h-12' key={index}>
                      <img
                        className='w-full h-full rounded-full'
                        src={contributor.image}
                        alt=''
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <div
            className='flex flex-col justify-end gap-4 p-10 cursor-pointer rounded-2xl w-[860px] h-[400px] bg-lore-beige-500 bg-cover bg-top 
              bg-[linear-gradient(180deg,rgba(0,0,0,0)0%,rgba(0,0,0,0.75)100%),url("/create-world-background.png")]'
            onClick={() => session?.user?.email ? setGenieFormOpen(true) : signIn()}
          >
            <div className='flex items-end self-stretch gap-20 text-white'>
              <div className='flex flex-col gap-2 grow'>
                <p className='flex font-cinzel font-medium text-[40px] leading-[54px] text-center'>
                  CREATE A NEW WORLD
                </p>
                <p className='self-stretch text-lg font-light leading-5'>
                  Use Lore Genie to create your next world for your next
                  homebrew campaign.
                </p>
              </div>
              <div className='flex items-center justify-center gap-2 px-8 py-6 font-medium transition-all duration-300 ease-out rounded-full bg-lore-red-400 hover:bg-lore-red-500'>
                <p className='text-xl leading-6 text-center min-w-max'>
                  Get Started
                </p>
                <span className='material-icons'>east</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {genieFormOpen && (
        <>
          <OutsideClickHandler
            onOutsideClick={() => setGenieFormOpen(false)}
            display='contents'
          >
            <div className='absolute z-20 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2'>
              <GenieForm
                onCreate={onCreate}
                setOpen={setGenieFormOpen}
                disabled={false}
              />
            </div>
          </OutsideClickHandler>
          <div className='fixed inset-0 z-10 w-full h-full overflow-y-auto bg-gray-600 bg-opacity-50' />
        </>
      )}
    </>
  );
};

export default HomePage;
