import React, { useId } from 'react';
import MuiCheckbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import { secondary, gray, fontFamily, fontSize, fontWeight, lineHeight } from '../../tokens';

export interface CheckboxProps {
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  id?: string;
  name?: string;
  value?: string;
  helperText?: string;
  className?: string;
}

// ─── Custom marks — sin caja propia, el theme maneja la caja (ROOT) ──────────

// Selected: solo el checkmark blanco — la caja azul viene del theme
const CheckedIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5 12L10 17L19 7"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Indeterminate: solo el dash — la caja lila viene del theme (primary.ultraLight)
const IndeterminateIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="7" y="11" width="10" height="2" rx="1" fill={secondary.main} />
  </svg>
);

// ─── Wrapper y HelperText ─────────────────────────────────────────────────────

const Wrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

const HelperText = styled('span')({
  fontFamily,
  fontSize: `${fontSize.xs}px`,
  fontWeight: fontWeight.regular,
  lineHeight,
  color: gray[400],
  paddingLeft: '32px',
});

// ─── Component ────────────────────────────────────────────────────────────────

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  defaultChecked,
  indeterminate = false,
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
        disabled={disabled}
        control={
          <MuiCheckbox
            id={inputId}
            name={name}
            value={value}
            checked={checked}
            defaultChecked={defaultChecked}
            indeterminate={indeterminate}
            disabled={disabled}
            disableRipple
            checkedIcon={<CheckedIcon />}
            indeterminateIcon={<IndeterminateIcon />}
            onChange={(e) => onChange?.(e.target.checked)}
            slotProps={{
              input: {
                'aria-describedby': helperText ? `${inputId}-helper` : undefined,
              },
            }}
          />
        }
        label={label ?? ''}
      />
      {helperText && (
        <HelperText id={`${inputId}-helper`}>{helperText}</HelperText>
      )}
    </Wrapper>
  );
};

export default Checkbox;
