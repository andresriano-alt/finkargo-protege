import React from 'react';
import styles from './Badge.module.css';

export type BadgeVariant = 'success' | 'info' | 'warning' | 'error' | 'neutral' | 'bag' | 'simple';
export type BadgeSize = 'small' | 'medium' | 'large';
export type BadgeStyle = 'light' | 'dark';

export interface BadgeProps {
  /** Badge text */
  label: string;
  /** Semantic color variant */
  variant?: BadgeVariant;
  /** Size — small (S), medium (M), large (L) */
  size?: BadgeSize;
  /** Light or Dark style */
  badgeStyle?: BadgeStyle;
  /** Show border. Default: true */
  border?: boolean;
  /** Show the right icon (info icon by default) */
  showIcon?: boolean;
  /** Show an icon on the left side */
  showIconLeft?: boolean;
  /** Custom icon node. Used for both left and right positions */
  icon?: React.ReactNode;
  /** Additional CSS class */
  className?: string;
}

// Default info icon — matches Figma circle-info SVG
const InfoIcon: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M8 7V11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="8" cy="5.5" r="0.6" fill="currentColor" />
  </svg>
);

// Color tokens extracted directly from Figma
const variantColors: Record<BadgeVariant, Record<BadgeStyle, { bg: string; border: string }>> = {
  success: {
    light: { bg: '#E0F7E6', border: '#AAEAA8' },
    dark:  { bg: '#AAEAA8', border: '#2CA14D' },
  },
  info: {
    light: { bg: '#E2F3FF', border: '#AADBFF' },
    dark:  { bg: '#AADBFF', border: '#0094FF' },
  },
  warning: {
    light: { bg: '#FFF2DB', border: '#F9B43A' },
    dark:  { bg: '#F9B43A', border: '#F98A3A' },
  },
  error: {
    light: { bg: '#FFE4E4', border: '#CC071E' },
    dark:  { bg: '#FFB5B5', border: '#97191A' },
  },
  neutral: {
    light: { bg: '#F9FAFC', border: '#D6DDF7' },
    dark:  { bg: '#A7A8C3', border: '#7D8EDF' },
  },
  bag: {
    light: { bg: '#F1F2FF', border: '#D6DDF7' },
    dark:  { bg: '#AAB7ED', border: '#7D8EDF' },
  },
  simple: {
    light: { bg: '#FFFFFF', border: '#E6E7F1' },
    dark:  { bg: '#F9FAFC', border: '#A7A8C3' },
  },
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'medium',
  badgeStyle = 'light',
  border = true,
  showIcon = false,
  showIconLeft = false,
  icon,
  className,
}) => {
  const colors = variantColors[variant][badgeStyle];

  const sizeClass = {
    small: styles.sizeSmall,
    medium: styles.sizeMedium,
    large: styles.sizeLarge,
  }[size];

  const rootClass = [styles.root, sizeClass, className ?? ''].filter(Boolean).join(' ');

  const iconNode = icon ?? <InfoIcon />;

  return (
    <span
      className={rootClass}
      style={{
        backgroundColor: colors.bg,
        border: border ? `1px solid ${colors.border}` : 'none',
        color: '#060735',
      }}
    >
      {showIconLeft && (
        <span className={styles.icon}>{iconNode}</span>
      )}
      {label}
      {showIcon && (
        <span className={styles.icon}>{iconNode}</span>
      )}
    </span>
  );
};

export default Badge;
