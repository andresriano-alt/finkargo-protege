import React, { useId } from 'react';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import { text } from '../../tokens';

export type ToggleSize = 'medium' | 'small';

export interface ToggleProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  loading?: boolean;
  size?: ToggleSize;
  label?: string;
  onChange?: (checked: boolean) => void;
  id?: string;
  className?: string;
}

const LabelText = styled('span')({
  fontFamily: '"Albert Sans", sans-serif',
  fontSize: '14px',
  fontWeight: 400,
  color: text.secondary,
  lineHeight: 1.4,
});

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  defaultChecked,
  disabled = false,
  loading = false,
  size = 'medium',
  label,
  onChange,
  id,
  className,
}) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const isDisabled = disabled || loading;

  const switchEl = (
    <Switch
      id={inputId}
      checked={checked}
      defaultChecked={defaultChecked}
      disabled={isDisabled}
      size={size}
      onChange={(e) => onChange?.(e.target.checked)}
      inputProps={{ role: 'switch', 'aria-checked': checked }}
    />
  );

  if (!label) {
    return <span className={className}>{switchEl}</span>;
  }

  return (
    <FormControlLabel
      control={switchEl}
      label={<LabelText>{label}</LabelText>}
      disabled={isDisabled}
      className={className}
      sx={{ margin: 0, gap: '8px', cursor: isDisabled ? 'not-allowed' : 'pointer' }}
    />
  );
};

export default Toggle;
