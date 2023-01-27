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
        <div className='flex max-w-fit w-full min-w-[320px]'>
          <nav className='flex w-full'>{nav}</nav>
        </div>
        <div className='flex w-full ml-[2px]'>{children}</div>
      </div>
    </div>
  );
}
