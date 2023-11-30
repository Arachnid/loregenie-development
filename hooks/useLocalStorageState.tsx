import { Dispatch, SetStateAction, useEffect, useState } from "react";

const parse = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

export const useLocalStorageState = <T extends {}>(
  key: string,
  initialState: T,
): [T, Dispatch<SetStateAction<T>>] => {
  const [state, setState] = useState<T>(initialState);

  useEffect(() => {
    const item = localStorage.getItem(key);
    if (item) {
      setState(parse(item));
    }
  }, [key]);

  useEffect(() => {
    if (JSON.stringify(state) !== JSON.stringify(initialState)) {
      localStorage.setItem(key, JSON.stringify(state));
    }
  }, [initialState, key, state]);

  return [state, setState];
};
