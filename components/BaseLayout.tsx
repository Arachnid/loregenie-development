'use client';

import { ReactNode } from 'react';

interface Props {
  nav: JSX.Element;
  children: ReactNode;
}

export default function BaseLayout({ nav, children }: Props) {
  return (
    <div className='flex flex-col w-full h-full'>
      <div className='flex h-full'>
        <div className='flex max-w-fit min-w-[300px]'>
          <nav className='flex w-full'>{nav}</nav>
        </div>
        <div className='flex bg-white w-full ml-[3px]'>{children}</div>
      </div>
    </div>
  );
}
