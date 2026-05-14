import React from 'react';
import MuiButton from '@mui/material/Button';
import { keyframes, styled } from '@mui/material/styles';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type ButtonSize = 'large' | 'medium' | 'small';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  'aria-label'?: string;
}

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const SpinnerSvg = styled('svg')({
  width: '16px',
  height: '16px',
  flexShrink: 0,
  animation: `${spin} 0.8s linear infinite`,
});

const Spinner = () => (
  <SpinnerSvg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle
      cx="8" cy="8" r="6"
      stroke="currentColor" strokeWidth="2"
      strokeDasharray="30" strokeDashoffset="10" strokeLinecap="round"
    />
  </SpinnerSvg>
);

const variantMap: Record<ButtonVariant, 'contained' | 'outlined' | 'text'> = {
  primary:   'contained',
  secondary: 'outlined',
  tertiary:  'text',
};

const sizeMap: Record<ButtonSize, 'large' | 'medium' | 'small'> = {
  large:  'large',
  medium: 'medium',
  small:  'small',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  disabled = false,
  loading = false,
  iconLeft,
  iconRight,
  onClick,
  type = 'button',
  className,
  'aria-label': ariaLabel,
}) => (
  <MuiButton
    variant={variantMap[variant]}
    size={sizeMap[size]}
    disabled={disabled || loading}
    onClick={onClick}
    type={type}
    className={className}
    aria-label={ariaLabel}
    aria-busy={loading}
    startIcon={loading ? <Spinner /> : iconLeft}
    endIcon={!loading ? iconRight : undefined}
  >
    {children}
  </MuiButton>
);

export default Button;
