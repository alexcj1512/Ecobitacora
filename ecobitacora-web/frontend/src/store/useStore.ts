import { create } from 'zustand';
import { User, Action, ChatMessage, Stats } from '@/types';

interface AppState {
  user: User | null;
  actions: Action[];
  chatMessages: ChatMessage[];
  stats: Stats | null;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User) => void;
  setActions: (actions: Action[]) => void;
  addAction: (action: Action) => void;
  deleteAction: (id: string) => void;
  setStats: (stats: Stats) => void;
  addChatMessage: (message: ChatMessage) => void;
  setChatMessages: (messages: ChatMessage[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  actions: [],
  chatMessages: [],
  stats: null,
  isLoading: false,
  
  setUser: (user) => set({ user }),
  setActions: (actions) => set({ actions }),
  addAction: (action) => set((state) => ({ actions: [action, ...state.actions] })),
  deleteAction: (id) => set((state) => ({ actions: state.actions.filter(a => a.id !== id) })),
  setStats: (stats) => set({ stats }),
  addChatMessage: (message) => set((state) => ({ chatMessages: [...state.chatMessages, message] })),
  setChatMessages: (messages) => set({ chatMessages: messages }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
