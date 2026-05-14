// Spacing scale extracted from Figma variables
// Scale: XXS=4, XS=8, SM=12, MS=16, MD=20, LG=24, XL=32, XXL=48
export const spacing = {
  none: '0px',
  xxs: '4px',
  xs: '8px',
  sm: '12px',
  ms: '16px',
  md: '20px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
} as const;

// Numeric values for calculations
export const spacingRaw = {
  none: 0,
  xxs: 4,
  xs: 8,
  sm: 12,
  ms: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export type SpacingKey = keyof typeof spacing;
export type Spacing = typeof spacing;
