import React, { useId } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import { styled } from '@mui/material/styles';
import {
  primary, quaternary, info, orange, gray, error,
  text, fontFamily,
} from '../../tokens';

// ─── Types ───────────────────────────────────────────────────────────────────

export type InputStatus = 'default' | 'error' | 'warning' | 'autoAI';

export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  status?: InputStatus;
  disabled?: boolean;
  helperText?: string;
  hintText?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  showLabelIcon?: boolean;
  type?: string;
  id?: string;
  name?: string;
  required?: boolean;
  className?: string;
  'aria-label'?: string;
}

// ─── Label row styled components ─────────────────────────────────────────────

const Wrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '100%',
});

const LabelRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '4px',
});

const LabelLeft = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
});

const LabelText = styled('label')({
  fontFamily,
  fontSize: '14px',
  fontWeight: 400,
  color: primary.dark,
  lineHeight: 1.4,
});

const RequiredAsterisk = styled('span')({
  color: error.main,
  marginLeft: '2px',
});

const LabelInfoIcon = () => (
  <svg
    width="16" height="16" viewBox="0 0 16 16"
    fill="none" xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={{ flexShrink: 0, color: gray[400] }}
  >
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
    <path d="M8 7v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="8" cy="5.5" r="0.75" fill="currentColor" />
  </svg>
);

const HintText = styled('span')({
  fontFamily,
  fontSize: '14px',
  fontWeight: 500,
  color: primary.light,
  lineHeight: 1.4,
  whiteSpace: 'nowrap',
});

const AutoAIBadge = styled('span')({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '2px 4px',
  background: quaternary.lighter,
  border: `1px solid ${quaternary.main}`,
  borderRadius: '4px',
  fontFamily,
  fontSize: '12px',
  fontWeight: 500,
  color: info.dark,
  lineHeight: 1.4,
  whiteSpace: 'nowrap',
});

const AutoAIIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M8 2L9.5 6.5L14 8L9.5 9.5L8 14L6.5 9.5L2 8L6.5 6.5L8 2Z" fill="#004B81" />
  </svg>
);

// ─── Status sx overrides ─────────────────────────────────────────────────────

const warningSx = {
  '& .MuiOutlinedInput-notchedOutline': { borderColor: orange.dark, borderWidth: '1.5px' },
  '&:hover:not(.Mui-disabled) .MuiOutlinedInput-notchedOutline': { borderColor: orange.dark },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: orange.dark, borderWidth: '1.5px' },
};

const autoAISx = {
  backgroundColor: quaternary.ultraLight,
  '& .MuiOutlinedInput-notchedOutline': { borderColor: quaternary.main, borderWidth: '1px' },
  '&:hover:not(.Mui-disabled) .MuiOutlinedInput-notchedOutline': { borderColor: quaternary.main },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: quaternary.main, borderWidth: '1.5px' },
};

const helperColorMap: Record<InputStatus, string> = {
  default: gray[400],
  error:   error.main,
  warning: orange.dark,
  autoAI:  gray[400],
};

// ─── Component ───────────────────────────────────────────────────────────────

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  defaultValue,
  onChange,
  status = 'default',
  disabled = false,
  helperText,
  hintText,
  iconLeft,
  iconRight,
  showLabelIcon = false,
  type = 'text',
  id,
  name,
  required,
  className,
  'aria-label': ariaLabel,
}) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const showLabelRow = !!(label || hintText || status === 'autoAI');

  const statusSx =
    status === 'warning' ? warningSx :
    status === 'autoAI'  ? autoAISx  :
    {};

  return (
    <Wrapper className={className}>
      {showLabelRow && (
        <LabelRow>
          <LabelLeft>
            {showLabelIcon && <LabelInfoIcon />}
            {label && (
              <LabelText htmlFor={inputId}>
                {label}
                {required && <RequiredAsterisk aria-hidden="true">*</RequiredAsterisk>}
              </LabelText>
            )}
          </LabelLeft>

          {status === 'autoAI' ? (
            <AutoAIBadge>
              <AutoAIIcon />
              Auto
            </AutoAIBadge>
          ) : hintText ? (
            <HintText>{hintText}</HintText>
          ) : null}
        </LabelRow>
      )}

      <OutlinedInput
        id={inputId}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        disabled={disabled}
        error={status === 'error'}
        required={required}
        inputProps={{
          'aria-label': ariaLabel,
          'aria-invalid': status === 'error',
          'aria-describedby': helperText ? `${inputId}-helper` : undefined,
        }}
        startAdornment={
          iconLeft ? (
            <InputAdornment position="start" sx={{ color: gray[400], '& svg': { width: '24px', height: '24px' } }}>
              {iconLeft}
            </InputAdornment>
          ) : undefined
        }
        endAdornment={
          iconRight ? (
            <InputAdornment position="end" sx={{ color: gray[400], '& svg': { width: '24px', height: '24px' } }}>
              {iconRight}
            </InputAdornment>
          ) : undefined
        }
        sx={statusSx}
      />

      {helperText && (
        <FormHelperText
          id={`${inputId}-helper`}
          error={status === 'error'}
          sx={{ color: helperColorMap[status], '&.Mui-error': { color: error.main } }}
        >
          {helperText}
        </FormHelperText>
      )}
    </Wrapper>
  );
};

export default Input;
