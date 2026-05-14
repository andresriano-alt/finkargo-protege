/**
 * Finkargo Design Tokens
 * Source: Figma node 2052-8673 — Color Palette
 * Auto-extracted from Figma variables. This file is the single source of truth
 * for all color and typography tokens in the design system.
 */

// ─── Color Tokens ────────────────────────────────────────────────────────────

export const primary = {
  dark:       '#060735',
  main:       '#1C1B66',
  light:      '#2128B1',
  lighter:    '#596BCE',
  ultraLight: '#D6DDF7',
  50:         '#F1F2FF',
} as const;

export const secondary = {
  main:    '#3C47D3',
  light:   '#7D8EDF',
  lighter: '#AAB7ED',
} as const;

export const quaternary = {
  main:       '#78F7FF',
  light:      '#B4FAFF',
  lighter:    '#E6FDFF',
  ultraLight: '#F1FEFF',
} as const;

export const orange = {
  dark:  '#F98A3A',
  main:  '#FFBF84',
  light: '#FDD5B0',
} as const;

export const gray = {
  white: '#FFFFFF',
  100:   '#F9FAFC',
  200:   '#E6E7F1',
  300:   '#A7A8C3',
  400:   '#6C6D8C',
} as const;

export const text = {
  primary:   '#393A55',
  secondary: '#4A4B6B',
} as const;

export const error = {
  dark:       '#97191A',
  main:       '#CC071E',
  light:      '#FFB5B5',
  ultraLight: '#FFE4E4',
} as const;

export const warning = {
  dark:  '#603E11',
  main:  '#F9B43A',
  light: '#FFF2DB',
} as const;

export const info = {
  dark:       '#004B81',
  main:       '#0094FF',
  light:      '#AADBFF',
  ultraLight: '#E2F3FF',
} as const;

export const success = {
  dark:       '#03593A',
  main:       '#2CA14D',
  light:      '#AAEAA8',
  ultraLight: '#E0F7E6',
} as const;

// ─── Typography Tokens ───────────────────────────────────────────────────────

export const fontFamily = '"Albert Sans", sans-serif';

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
} as const;

export const fontWeight = {
  regular:  400,
  medium:   500,
  semiBold: 600,
} as const;

export const lineHeight = 1.4;

// ─── Grouped export ──────────────────────────────────────────────────────────

const tokens = {
  color: {
    primary,
    secondary,
    quaternary,
    orange,
    gray,
    text,
    error,
    warning,
    info,
    success,
  },
  typography: {
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
  },
} as const;

export default tokens;
