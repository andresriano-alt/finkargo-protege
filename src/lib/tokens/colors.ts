export const colors = {
  // Base
  white: '#FFFFFF',
  black: '#000000',

  // Primary (Navy)
  primary: {
    900: '#060735',
    800: '#0A0A52',
    700: '#0E0E6E',
    600: '#12128B',
    500: '#1616A8',
    400: '#4444BF',
    300: '#7272D5',
    200: '#A1A1E6',
    100: '#D0D0F2',
    50: '#EAEAF9',
  },

  // Secondary (Blue/Indigo)
  secondary: {
    main: '#3C47D3',
    900: '#1A23A8',
    800: '#2330BD',
    700: '#2C3BC8',
    600: '#3444D0',
    500: '#3C47D3',
    400: '#5D68DC',
    300: '#7E89E5',
    200: '#9EAAEE',
    100: '#BFCAF7',
    50: '#E8ECFC',
  },

  // Neutral (Gray)
  neutral: {
    900: '#111827',
    800: '#1F2937',
    700: '#374151',
    600: '#4B5563',
    500: '#6B7280',
    400: '#9CA3AF',
    300: '#D1D5DB',
    200: '#E5E7EB',
    100: '#F3F4F6',
    50: '#F9FAFB',
  },

  // Semantic
  success: {
    main: '#10B981',
    dark: '#065F46',
    light: '#D1FAE5',
    bg: '#ECFDF5',
  },
  warning: {
    main: '#F59E0B',
    dark: '#92400E',
    light: '#FEF3C7',
    bg: '#FFFBEB',
  },
  error: {
    main: '#EF4444',
    dark: '#7F1D1D',
    light: '#FEE2E2',
    bg: '#FEF2F2',
  },
  info: {
    main: '#3B82F6',
    dark: '#1E3A8A',
    light: '#DBEAFE',
    bg: '#EFF6FF',
  },
} as const;

export type Colors = typeof colors;
