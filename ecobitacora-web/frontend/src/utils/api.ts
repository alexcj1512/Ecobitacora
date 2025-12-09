import { User, Action, Stats, ChatMessage } from '@/types';

const API_URL = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error al iniciar sesión');
    }
    return res.json();
  },

  async register(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error al registrarse');
    }
    return res.json();
  },

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  },

  // User
  async getUser(): Promise<User> {
    const res = await fetch(`${API_URL}/user`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Error al obtener usuario');
    return res.json();
  },

  async updateUser(data: Partial<User>): Promise<User> {
    const res = await fetch(`${API_URL}/user`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al actualizar usuario');
    return res.json();
  },

  // Actions
  async getActions(params?: { limit?: number; offset?: number; category?: string }): Promise<Action[]> {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_URL}/actions?${query}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Error al obtener acciones');
    return res.json();
  },

  async createAction(action: Omit<Action, 'id' | 'date'>): Promise<Action> {
    const res = await fetch(`${API_URL}/actions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(action),
    });
    if (!res.ok) throw new Error('Error al crear acción');
    return res.json();
  },

  async deleteAction(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/actions/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Error al eliminar acción');
  },

  // Stats
  async getStats(): Promise<Stats> {
    const res = await fetch(`${API_URL}/stats`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Error al obtener estadísticas');
    return res.json();
  },

  // Chat
  async sendChatMessage(message: string): Promise<{ response: string }> {
    const res = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ message }),
    });
    if (!res.ok) throw new Error('Error al enviar mensaje');
    return res.json();
  },

  async getChatHistory(): Promise<ChatMessage[]> {
    const res = await fetch(`${API_URL}/chat/history`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Error al obtener historial');
    return res.json();
  },

  // Achievements
  async checkAchievements(): Promise<{ newAchievements: string[] }> {
    const res = await fetch(`${API_URL}/achievements/check`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Error al verificar logros');
    return res.json();
  },
};
