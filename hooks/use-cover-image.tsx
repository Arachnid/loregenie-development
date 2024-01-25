import { create } from "zustand";

type CoverImageStore = {
  url?: string;
  isOpen: boolean;
  worldID?: string;
  entryID?: string;
  onOpen: ({
    worldID,
    entryID,
  }: {
    worldID?: string;
    entryID?: string;
  }) => void;
  onClose: () => void;
  onReplace: (url: string) => void;
};

export const useCoverImage = create<CoverImageStore>((set) => ({
  url: undefined,
  worldID: undefined,
  entryID: undefined,
  isOpen: false,
  onOpen: ({ worldID, entryID }) =>
    set({ isOpen: true, url: undefined, worldID, entryID }),
  onClose: () => set({ isOpen: false, url: undefined }),
  onReplace: (url: string) => set({ isOpen: true, url }),
}));
