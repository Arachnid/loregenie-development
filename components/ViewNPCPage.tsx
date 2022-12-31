'use client';

import { NPC } from '@/types';

interface Props {
  npc: NPC;
}

const ViewNPCPage = ({ npc }: Props) => {
  return (
    <>
      <h1>NPC</h1>
      {Object.entries(npc).map((property, index) => {
        return (
          <div key={index}>
            {property[0]}: {`${property[1]}`}
          </div>
        );
      })}
    </>
  );
};

export default ViewNPCPage;
