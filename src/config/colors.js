export const COLORS = {
  blue: {
    label: 'Azul',
    accent: '#3b82f6',
    gradient: 'linear-gradient(135deg, #2563eb, #38bdf8)',
    glow: 'rgba(59, 130, 246, 0.35)',
  },
  purple: {
    label: 'Roxo',
    accent: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    glow: 'rgba(139, 92, 246, 0.35)',
  },
  pink: {
    label: 'Rosa',
    accent: '#ec4899',
    gradient: 'linear-gradient(135deg, #db2777, #f472b6)',
    glow: 'rgba(236, 72, 153, 0.35)',
  },
  red: {
    label: 'Vermelho',
    accent: '#ef4444',
    gradient: 'linear-gradient(135deg, #dc2626, #f97316)',
    glow: 'rgba(239, 68, 68, 0.35)',
  },
  orange: {
    label: 'Laranja',
    accent: '#f97316',
    gradient: 'linear-gradient(135deg, #ea580c, #fbbf24)',
    glow: 'rgba(249, 115, 22, 0.35)',
  },
  green: {
    label: 'Verde',
    accent: '#22c55e',
    gradient: 'linear-gradient(135deg, #16a34a, #4ade80)',
    glow: 'rgba(34, 197, 94, 0.35)',
  },
  teal: {
    label: 'Verde-água',
    accent: '#14b8a6',
    gradient: 'linear-gradient(135deg, #0d9488, #2dd4bf)',
    glow: 'rgba(20, 184, 166, 0.35)',
  },
  cyan: {
    label: 'Ciano',
    accent: '#06b6d4',
    gradient: 'linear-gradient(135deg, #0891b2, #22d3ee)',
    glow: 'rgba(6, 182, 212, 0.35)',
  },
  slate: {
    label: 'Cinza',
    accent: '#64748b',
    gradient: 'linear-gradient(135deg, #475569, #94a3b8)',
    glow: 'rgba(100, 116, 139, 0.35)',
  },
};

export const COLOR_KEYS = Object.keys(COLORS);

export function getColor(key) {
  return COLORS[key] ?? COLORS.blue;
}
