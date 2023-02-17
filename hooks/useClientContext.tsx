'use client';

import { useContext } from 'react';
import { ClientContext } from '@/context/ClientContext';

export const useClientContext = () => {
  const context = useContext(ClientContext);

  if (!context) {
    throw new Error('useClientContext must be used within ClientProvider.');
  }
  
  return context;
};
