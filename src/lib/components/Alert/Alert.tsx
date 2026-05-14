import React from 'react';
import MuiAlert from '@mui/material/Alert';
import MuiAlertTitle from '@mui/material/AlertTitle';
import MuiButton from '@mui/material/Button';
import { primary } from '../../tokens';

export type AlertVariant = 'info' | 'warning' | 'error' | 'success';
export type AlertStyle = 'fill' | 'border';

export interface AlertProps {
  variant?: AlertVariant;
  alertStyle?: AlertStyle;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const alertVariantMap: Record<AlertStyle, 'filled' | 'outlined'> = {
  fill:   'filled',
  border: 'outlined',
};

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  alertStyle = 'fill',
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => (
  <MuiAlert
    severity={variant}
    variant={alertVariantMap[alertStyle]}
    className={className}
    action={
      actionLabel ? (
        <MuiButton
          variant="outlined"
          size="small"
          onClick={onAction}
          sx={{
            height: '40px',
            borderRadius: '24px',
            border: `1px solid ${primary.light}`,
            color: primary.light,
            fontSize: '14px',
            padding: '10px 16px',
            '&:hover': {
              background: `${primary[50]}`,
              borderColor: primary.light,
            },
          }}
        >
          {actionLabel}
        </MuiButton>
      ) : undefined
    }
  >
    <MuiAlertTitle>{title}</MuiAlertTitle>
    {description}
  </MuiAlert>
);

export default Alert;
