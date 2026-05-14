export const shadows = {
  none: 'none',
  xs: '0px 1px 2px rgba(0, 0, 0, 0.05)',
  sm: '0px 1px 3px rgba(0, 0, 0, 0.10), 0px 1px 2px rgba(0, 0, 0, 0.06)',
  md: '0px 4px 6px rgba(0, 0, 0, 0.07), 0px 2px 4px rgba(0, 0, 0, 0.06)',
  lg: '0px 10px 15px rgba(0, 0, 0, 0.10), 0px 4px 6px rgba(0, 0, 0, 0.05)',
  xl: '0px 20px 25px rgba(0, 0, 0, 0.10), 0px 10px 10px rgba(0, 0, 0, 0.04)',
  '2xl': '0px 25px 50px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0px 2px 4px rgba(0, 0, 0, 0.06)',
} as const;

export type ShadowKey = keyof typeof shadows;
export type Shadows = typeof shadows;
