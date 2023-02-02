import { RefObject, useEffect, useRef } from 'react';

export const useOutsideClick = <T extends HTMLElement>(callback: () => void): RefObject<T> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current
        && event.target instanceof HTMLElement
        && !ref.current.contains(event.target)
      ) {
        callback();
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [ callback, ref ]);

  return ref;
};