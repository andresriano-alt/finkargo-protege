import React, { useId } from 'react';
import MuiRadio from '@mui/material/Radio';
import MuiRadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import { gray } from '../../tokens';

export interface RadioButtonProps {
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
  id?: string;
  name?: string;
  value?: string;
  helperText?: string;
  className?: string;
}

export interface RadioGroupOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioGroupOption[];
  value?: string;
  onChange?: (value: string) => void;
  name: string;
  disabled?: boolean;
  direction?: 'vertical' | 'horizontal';
  className?: string;
}

const Wrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

const HelperText = styled('span')({
  fontFamily: '"Albert Sans", sans-serif',
  fontSize: '12px',
  color: gray[400],
  paddingLeft: '24px',
});

export const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  checked,
  defaultChecked,
  disabled = false,
  onChange,
  id,
  name,
  value,
  helperText,
  className,
}) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <Wrapper className={className}>
      <FormControlLabel
        control={
          <MuiRadio
            id={inputId}
            name={name}
            value={value}
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            onChange={(e) => e.target.checked && onChange?.(e.target.value ?? '')}
            inputProps={{
              'aria-describedby': helperText ? `${inputId}-helper` : undefined,
            }}
          />
        }
        label={label ?? ''}
        disabled={disabled}
      />
      {helperText && (
        <HelperText id={`${inputId}-helper`}>{helperText}</HelperText>
      )}
    </Wrapper>
  );
};

export const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  value,
  onChange,
  name,
  disabled = false,
  direction = 'vertical',
  className,
}) => (
  <MuiRadioGroup
    name={name}
    value={value ?? ''}
    onChange={(e) => onChange?.(e.target.value)}
    row={direction === 'horizontal'}
    className={className}
    sx={{
      gap: direction === 'horizontal' ? '16px' : '10px',
      flexWrap: direction === 'horizontal' ? 'wrap' : undefined,
    }}
  >
    {options.map((opt) => (
      <FormControlLabel
        key={opt.value}
        value={opt.value}
        control={<MuiRadio disabled={disabled || opt.disabled} />}
        label={opt.label}
        disabled={disabled || opt.disabled}
      />
    ))}
  </MuiRadioGroup>
);

export default RadioButton;
