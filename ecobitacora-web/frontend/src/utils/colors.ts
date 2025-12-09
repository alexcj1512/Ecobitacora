// Utility functions for handling dynamic colors in Tailwind

export const getIconColor = (color: string): string => {
  const colors: Record<string, string> = {
    primary: 'text-[#6B9080]',
    success: 'text-[#66BB6A]',
    energy: 'text-[#FFB74D]',
    streak: 'text-[#FF6B35]',
    transport: 'text-[#4A90E2]',
    recycle: 'text-[#7CB342]',
    water: 'text-[#29B6F6]',
  };
  return colors[color] || 'text-gray-500';
};

export const getGradientClasses = (color: string): string => {
  const gradients: Record<string, string> = {
    streak: 'from-[#FF6B35] to-orange-500',
    primary: 'from-[#6B9080] to-[#8FAA96]',
    success: 'from-[#66BB6A] to-green-600',
    energy: 'from-[#FFB74D] to-orange-400',
    transport: 'from-[#4A90E2] to-blue-500',
    recycle: 'from-[#7CB342] to-green-500',
    water: 'from-[#29B6F6] to-blue-400',
  };
  return gradients[color] || 'from-gray-400 to-gray-600';
};

export const getBgColor = (color: string): string => {
  const colors: Record<string, string> = {
    transport: 'bg-[#4A90E2]',
    recycle: 'bg-[#7CB342]',
    energy: 'bg-[#FFB74D]',
    water: 'bg-[#29B6F6]',
    primary: 'bg-[#6B9080]',
    success: 'bg-[#66BB6A]',
    streak: 'bg-[#FF6B35]',
  };
  return colors[color] || 'bg-gray-500';
};
