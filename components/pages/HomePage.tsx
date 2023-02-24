'use client';

import { World } from '@/types';
import GenieForm from '@/components/GenieForm';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { signIn } from 'next-auth/react';
import removeMd from 'remove-markdown';

type Props = {
  worlds: World[];
  session: Session | null;
};

const HomePage = ({ worlds, session }: Props) => {
  const [genieFormOpen, setGenieFormOpen] = useState(false);
  const email = session?.user?.email as string;
  const router = useRouter();

  const world: Partial<World> = {
    name: '',
    description: '',
    image: '',
    readers: [email],
    writers: [email],
    admins: [email],
    public: false,
    entries: [],
    campaigns: [],
  };

  const onCreate = async (prompt?: string) => {
    try {
      world.prompt = prompt;
      await fetch('/api/world/create', {
        method: 'POST',
        body: JSON.stringify(world),
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
      <div className='flex flex-col justify-between h-full overflow-y-scroll scrollbar-hide bg-lore-beige-100'>
        <img
          className='fixed object-cover w-full h-full translate-y-80 mix-blend-multiply'
          src='/background.svg'
          alt=''
        />
        <div className='z-10 flex flex-col items-center gap-4 p-4 md:gap-6 md:py-12'>
          {worlds.map((world, index) => (
            <div
              className='flex flex-col md:justify-end gap-4 p-4 cursor-pointer rounded-2xl w-full h-[360px] bg-lore-beige-500 bg-cover md:max-w-[860px] md:h-[400px] md:p-10'
              style={{backgroundImage: `linear-gradient(180deg,rgba(0,0,0,0)0%,rgba(0,0,0,0.75)100%),url(${world.image ? world.image : '/eryndor.svg'})`}}
              onClick={() => router.push(`/world/${world.id}`)}
              key={index}
            >
              <div className='flex flex-col-reverse items-end justify-between h-full gap-20 md:flex-row'>
                <div className='flex flex-col w-full gap-2 text-white'>
                  <p className='flex font-cinzel font-medium text-[40px] leading-[54px] text-center justify-center md:justify-start'>
                    {world.name ? world.name.toUpperCase() : 'UNTITLED'}
                  </p>
                  <p className='hidden text-lg font-light leading-5 md:line-clamp-6'>
                    {removeMd(world.description)}
                  </p>
                </div>
                <div className='flex gap-2 md:flex-col-reverse'>
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
            className='flex flex-col md:justify-end gap-4 p-4 cursor-pointer rounded-2xl w-full h-[360px] bg-lore-beige-500 bg-cover bg-top 
            bg-[linear-gradient(0deg,rgba(0,0,0,0.75),rgba(0,0,0,0.75)),url("/create-world-background.png")]
            md:bg-[linear-gradient(180deg,rgba(0,0,0,0)0%,rgba(0,0,0,0.75)100%),url("/create-world-background.png")]
            md:max-w-[860px] md:h-[400px] md:p-10'
            onClick={() =>
              session?.user?.email ? setGenieFormOpen(true) : signIn()
            }
          >
            <div className='flex flex-col self-stretch justify-between h-full gap-4 text-white md:gap-20 md:items-end md:flex-row'>
              <div className='flex flex-col gap-2 grow'>
                <p className='flex justify-center font-cinzel font-medium text-[40px] leading-[54px] text-center md:text-left md:justify-start'>
                  CREATE A NEW WORLD
                </p>
                <p className='self-stretch text-lg font-light leading-5 text-center md:text-left'>
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
        <div className='flex flex-col self-stretch gap-4 px-12 py-6'>
          <div className='flex items-center self-stretch gap-40'>
            <div className='flex flex-col items-center gap-6 md:flex-row grow'>
              <img className='w-[83px]' src='/lore-genie-logo-2.svg' alt='' />
              <p className='text-xs text-center md:text-left grow'>
                All AI-generated content is Copyright 2022 Lore Genie and
                licensed <u>CC-BY</u>.<br />
                Note that we may use content you generate with Lore Genie to
                train and improve future versions of the system.
              </p>
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
            <div className='absolute z-20 w-full px-2 -translate-x-1/2 -translate-y-1/2 md:w-auto top-1/2 left-1/2'>
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
