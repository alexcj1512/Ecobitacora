export interface User {
  name: string;
  level: number;
  xp: number;
  streak: number;
  maxStreak: number;
  totalCO2: number;
  totalActions: number;
  achievements: string[];
  createdAt: string;
  lastActionDate: string | null;
  logoUrl?: string;
}

export interface Action {
  id: string;
  category: 'transport' | 'recycle' | 'energy' | 'water';
  type: string;
  amount: number;
  co2Saved: number;
  xpGained: number;
  date: string;
  photo?: string; // Optional photo for challenges
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Stats {
  totalActions: number;
  totalCO2: number;
  averageDaily: number;
  maxStreak: number;
  byCategory: {
    transport: number;
    recycle: number;
    energy: number;
    water: number;
  };
  last30Days: Array<{ date: string; co2: number; actions: number }>;
}

export const ACTION_TYPES = {
  transport: [
    { id: 'bicicleta', label: 'Bicicleta', icon: '🚴', co2PerUnit: 0.192, unit: 'km' },
    { id: 'caminar', label: 'Caminar', icon: '🚶', co2PerUnit: 0.192, unit: 'km' },
    { id: 'transporte_publico', label: 'Transporte Público', icon: '🚌', co2PerUnit: 0.089, unit: 'km' },
    { id: 'carpool', label: 'Compartir Auto', icon: '🚗', co2PerUnit: 0.096, unit: 'km' },
  ],
  recycle: [
    { id: 'plastico', label: 'Plástico', icon: '♻️', co2PerUnit: 1.5, unit: 'kg' },
    { id: 'papel', label: 'Papel', icon: '📄', co2PerUnit: 0.9, unit: 'kg' },
    { id: 'vidrio', label: 'Vidrio', icon: '🍾', co2PerUnit: 0.3, unit: 'kg' },
    { id: 'metal', label: 'Metal', icon: '🥫', co2PerUnit: 2.1, unit: 'kg' },
  ],
  energy: [
    { id: 'luz_1h', label: 'Apagar Luz 1h', icon: '💡', co2PerUnit: 0.04, unit: 'horas' },
    { id: 'desconectar', label: 'Desconectar Aparatos', icon: '🔌', co2PerUnit: 0.02, unit: 'aparatos' },
    { id: 'led', label: 'Cambiar a LED', icon: '💡', co2PerUnit: 0.5, unit: 'focos' },
    { id: 'solar', label: 'Usar Energía Solar', icon: '☀️', co2PerUnit: 0.8, unit: 'kWh' },
  ],
  water: [
    { id: 'ducha_corta', label: 'Ducha Corta', icon: '🚿', co2PerUnit: 0.12, unit: 'duchas' },
    { id: 'cerrar_grifo', label: 'Cerrar Grifo', icon: '🚰', co2PerUnit: 0.05, unit: 'veces' },
    { id: 'reutilizar', label: 'Reutilizar Agua', icon: '💧', co2PerUnit: 0.08, unit: 'litros' },
    { id: 'lavavajillas', label: 'Lavavajillas Lleno', icon: '🍽️', co2PerUnit: 0.15, unit: 'cargas' },
  ],
};

export const ACHIEVEMENTS = [
  { id: 'first_action', name: 'Primer Paso', description: 'Registra tu primera acción', icon: '🌱', requirement: 1 },
  { id: 'week_streak', name: 'Semana Verde', description: 'Mantén 7 días de racha', icon: '🔥', requirement: 7 },
  { id: 'month_streak', name: 'Mes Ecológico', description: 'Mantén 30 días de racha', icon: '🏆', requirement: 30 },
  { id: 'co2_10kg', name: 'Guardián del Aire', description: 'Ahorra 10kg de CO₂', icon: '🌍', requirement: 10 },
  { id: 'co2_50kg', name: 'Héroe Climático', description: 'Ahorra 50kg de CO₂', icon: '⭐', requirement: 50 },
  { id: 'co2_100kg', name: 'Leyenda Verde', description: 'Ahorra 100kg de CO₂', icon: '👑', requirement: 100 },
  { id: 'level_5', name: 'Experto Eco', description: 'Alcanza nivel 5', icon: '🎖️', requirement: 5 },
  { id: 'level_10', name: 'Maestro Verde', description: 'Alcanza nivel 10', icon: '🥇', requirement: 10 },
  { id: 'actions_50', name: 'Activista', description: 'Registra 50 acciones', icon: '✊', requirement: 50 },
  { id: 'actions_100', name: 'Eco Warrior', description: 'Registra 100 acciones', icon: '⚡', requirement: 100 },
];
