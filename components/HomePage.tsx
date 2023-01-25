'use client';

import { World } from '@/types';
import Link from 'next/link';

type Props = {
  worlds: World[];
};

const HomePage = ({ worlds }: Props) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {worlds &&
        worlds.map((world, index) => {
          return (
            <Link key={index} href={`/world/${world.id}`}>
              {world.name}
            </Link>
          );
        })}
      <Link href={'/world/new'}>Create World</Link>
    </div>
  );
};

export default HomePage;
