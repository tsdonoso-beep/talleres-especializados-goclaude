export const colors = {
  dark: '#043941', mid: '#045f6c',
  green: '#02d47e', green2: '#00c16e',
  mint: '#d2ffe1', ice: '#e3f8fb',
  bg: '#f7fafa', white: '#ffffff',
  text1: '#4a5568', text2: '#718096', text3: '#94a3b8',
  border: '#e2e8f0',
} as const;

export const talleres = {
  T1: { name: 'Mecánica Automotriz',    accent: '#F97316', textOnAccent: '#ffffff' },
  T2: { name: 'Industria del Vestido',  accent: '#F472B6', textOnAccent: '#ffffff' },
  T3: { name: 'Cocina y Repostería',    accent: '#FBBF24', textOnAccent: '#78350f' },
  T4: { name: 'Ebanistería',            accent: '#C8956C', textOnAccent: '#ffffff' },
  T5: { name: 'Comp. e Informática',    accent: '#3B82F6', textOnAccent: '#ffffff' },
  T6: { name: 'Electrónica',            accent: '#8B5CF6', textOnAccent: '#ffffff' },
  T7: { name: 'Ind. Alimentaria',       accent: '#FB923C', textOnAccent: '#ffffff' },
  T8: { name: 'Electricidad',           accent: '#F59E0B', textOnAccent: '#78350f' },
  T9: { name: 'Const. Metálicas',       accent: '#94A3B8', textOnAccent: '#ffffff' },
} as const;

export const radius = {
  sm: '6px', md: '10px', lg: '12px', xl: '16px', pill: '100px',
} as const;

export const semantic = {
  success: { bg: '#d1fae5', text: '#065f46' },
  warning: { bg: '#fef3c7', text: '#92400e' },
  danger:  { bg: '#fee2e2', text: '#991b1b' },
  info:    { bg: '#eff6ff', text: '#1e40af' },
  live:    { bg: '#fee2e2', text: '#991b1b', dot: '#dc2626' },
  next:    { bg: '#fef3c7', text: '#92400e', dot: '#d97706' },
  done:    { bg: '#f0fdf4', text: '#166534', dot: '#16a34a' },
  async:   { bg: '#f1f5f9', text: '#64748b', dot: '#94a3b8' },
} as const;

export type TallerId = keyof typeof talleres;
