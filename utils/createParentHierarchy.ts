import { Entry, EntryHierarchy } from '@/types';

export const createParentHierarchy = (entries: Entry[]): EntryHierarchy[] => {
  const result: EntryHierarchy[] = [];
  const mappedEntries: Record<string, EntryHierarchy> = {};
  entries.forEach((entry: Entry) => {
    const id: string = entry.id;
    if (!mappedEntries.hasOwnProperty(id)) {
      mappedEntries[id] = entry;
      mappedEntries[id].children = [];
    }
  });
  for (const id in mappedEntries) {
    if (mappedEntries.hasOwnProperty(id)) {
      const mappedEntry: EntryHierarchy = mappedEntries[id];
      if (mappedEntry.parent) {
        const parentID: string = mappedEntry.parent.id;
        mappedEntries[parentID].children?.push(mappedEntry);
      } else {
        result.push(mappedEntry);
      }
    }
  }
  return result;
};
