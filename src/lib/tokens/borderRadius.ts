// Border radius scale — matches spacing scale from Figma
export const borderRadius = {
  none: '0px',
  xxs: '4px',
  xs: '8px',
  sm: '12px',
  ms: '16px',
  md: '20px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  full: '9999px',
} as const;

export type BorderRadiusKey = keyof typeof borderRadius;
export type BorderRadius = typeof borderRadius;
