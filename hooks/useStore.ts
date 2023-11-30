import { World } from "@/types";
import { ChatCompletionMessageParam } from "openai/resources";
import { create } from "zustand";

export type AssistanState = {
  world: World;
  setWorld: (world: World) => void;
  conversation: Array<ChatCompletionMessageParam>;
  assistantResponse: Partial<World>;
  setAssistantResponse: (response: Partial<World>) => void;
  saveToLocalStorage: (key: string, value: any) => void;
  loadFromLocalStorage: (key: string) => any;
};

const useStore = create<AssistanState>((set, get) => ({
  world: {} as World,
  setWorld(world: World) {
    set((state) => ({
      ...state,
      world,
    }));
  },
  conversation: [],
  assistantResponse: {},
  setAssistantResponse(response: Partial<World>) {
    set((state) => ({
      ...state,
      assistantResponse: response,
    }));
  },
  saveToLocalStorage: (key, value) => {
    try {
      console.log("saving local");
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error("Error saving to local storage:", error);
    }
  },
  loadFromLocalStorage: (key) => {
    try {
      const serializedValue = localStorage.getItem(key);
      return serializedValue ? JSON.parse(serializedValue) : null;
    } catch (error) {
      console.error("Error loading from local storage:", error);
      return null;
    }
  },
}));

export default useStore;
