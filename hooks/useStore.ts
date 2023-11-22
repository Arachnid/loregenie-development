import { create } from 'zustand'
import { World } from '@/types';
import { ChatCompletionMessageParam } from 'openai/resources';

export type AssistanState = {
    world: World;
    setWorld: (world: World) => void;
    conversation: Array<ChatCompletionMessageParam>,
    assistantResponse?: Partial<World>,
    setAssistantResponse?: (response: Partial<World>) => void;
}

const useStore = create<AssistanState>((set) => ({
    world: {} as World,

    setWorld(world: World){
        set((state) => ({
            ...state,
            world
        }))
    },
    conversation: [],
    assistantResponse: {},
    setAssistantResponse(response: Partial<World>){
        set((state) => ({
            ...state,
            assistantResponse: response
        }))
    }
}));

export default useStore;