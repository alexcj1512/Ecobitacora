import { Action, User } from '@/types';

export const exportToCSV = (actions: Action[], user: User) => {
  const headers = ['Fecha', 'Categoría', 'Tipo', 'Cantidad', 'CO₂ Ahorrado (kg)', 'XP Ganado'];
  const rows = actions.map(action => [
    new Date(action.date).toLocaleDateString(),
    action.category,
    action.type,
    action.amount,
    action.co2Saved,
    action.xpGained
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `ecobitacora-${user.name}-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};

export const exportToJSON = (actions: Action[], user: User) => {
  const data = {
    user: {
      name: user.name,
      level: user.level,
      xp: user.xp,
      totalCO2: user.totalCO2,
      streak: user.streak,
      maxStreak: user.maxStreak,
      totalActions: user.totalActions,
      achievements: user.achievements,
    },
    actions,
    exportDate: new Date().toISOString(),
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `ecobitacora-${user.name}-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
};

export const copyToClipboard = async (actions: Action[], user: User) => {
  const text = actions.map(a => 
    `${new Date(a.date).toLocaleDateString()} - ${a.type}: ${a.co2Saved}kg CO₂`
  ).join('\n');
  
  await navigator.clipboard.writeText(text);
  return true;
};
