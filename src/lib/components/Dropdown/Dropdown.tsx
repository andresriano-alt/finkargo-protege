import React, { useState, useRef, useEffect, useId } from 'react';
import { styled } from '@mui/material/styles';
import {
  primary, secondary, gray, error, orange, success, text,
  fontFamily,
} from '../../tokens';

export interface DropdownOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export type DropdownSize = 'large' | 'medium' | 'small';

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, option: DropdownOption) => void;
  placeholder?: string;
  label?: string;
  size?: DropdownSize;
  disabled?: boolean;
  searchable?: boolean;
  helperText?: string;
  errorText?: string;
  warningText?: string;
  successText?: string;
  className?: string;
}

// ─── Tamaños ──────────────────────────────────────────────────────────────────

const sizeStyles: Record<DropdownSize, object> = {
  large:  { height: '48px', padding: '0 16px', fontSize: '14px' },
  medium: { height: '40px', padding: '0 12px', fontSize: '14px' },
  small:  { height: '32px', padding: '0 10px', fontSize: '12px' },
};

// ─── Icons ────────────────────────────────────────────────────────────────────

const ChevronDown = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="24" height="24">
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="24" height="24">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
    <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="24" height="24">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const WarningIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="24" height="24">
    <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="24" height="24">
    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Styled Components ────────────────────────────────────────────────────────

const Wrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  position: 'relative',
  width: '100%',
});

const Label = styled('label')({
  fontFamily,
  fontSize: '14px',
  fontWeight: 400,
  color: primary.dark,
});

const Trigger = styled('button')<{
  ownerState: {
    size: DropdownSize;
    open: boolean;
    disabled: boolean;
    hasError: boolean;
    hasWarning: boolean;
    hasSuccess: boolean;
  };
}>(({ ownerState }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  width: '100%',
  fontFamily,
  fontWeight: 400,
  color: primary.dark,
  background: gray.white,
  border: `1px solid ${gray[300]}`,
  borderRadius: '8px',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'border-color 150ms ease, box-shadow 150ms ease',
  outline: 'none',
  ...sizeStyles[ownerState.size],

  '&:hover:not(:disabled)': { borderColor: gray[400] },

  ...(ownerState.open && {
    borderColor: secondary.main,
    boxShadow: '0px 0px 5px 0px rgba(33, 40, 177, 0.2)',
  }),

  '&:focus-visible': {
    borderColor: secondary.main,
    boxShadow: '0px 0px 5px 0px rgba(33, 40, 177, 0.2)',
  },

  ...(ownerState.disabled && {
    background: gray[100],
    borderColor: gray[200],
    color: gray[300],
    cursor: 'not-allowed',
  }),

  ...(ownerState.hasError && {
    borderColor: error.main,
  }),

  ...(ownerState.hasWarning && !ownerState.hasError && {
    borderColor: orange.dark,
  }),

  ...(ownerState.hasSuccess && !ownerState.hasError && !ownerState.hasWarning && {
    borderColor: success.main,
  }),
}));

const PlaceholderText = styled('span')({
  color: text.primary,
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const SelectedText = styled('span')({
  color: primary.dark,
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const IconSlot = styled('span')<{ ownerState?: { open?: boolean } }>(({ ownerState }) => ({
  display: 'inline-flex',
  flexShrink: 0,
  color: gray[400],
  transition: 'transform 200ms ease',
  ...(ownerState?.open !== undefined && {
    transform: ownerState.open ? 'rotate(180deg)' : 'none',
  }),
}));

const ClearButton = styled('button')({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  color: gray[400],
  flexShrink: 0,
  '&:hover': { color: gray[400] },
});

const Menu = styled('div')({
  position: 'absolute',
  top: 'calc(100% + 4px)',
  left: 0,
  right: 0,
  background: gray.white,
  border: `1px solid ${gray[200]}`,
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  maxHeight: '240px',
  overflowY: 'auto',
  zIndex: 50,
});

const SearchWrapper = styled('div')({
  padding: '8px 8px 4px',
  borderBottom: `1px solid ${gray[100]}`,
});

const SearchInput = styled('input')({
  width: '100%',
  boxSizing: 'border-box',
  padding: '6px 10px',
  border: `1px solid ${gray[200]}`,
  borderRadius: '6px',
  fontFamily,
  fontSize: '13px',
  color: primary.dark,
  outline: 'none',
  '&:focus': { borderColor: secondary.main },
});

const Option = styled('button')<{
  ownerState: { active: boolean; disabled: boolean };
}>(({ ownerState }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  width: '100%',
  textAlign: 'left',
  padding: '14px 10px',
  fontFamily,
  fontSize: '14px',
  fontWeight: ownerState.active ? 500 : 400,
  color: ownerState.disabled
    ? gray[300]
    : ownerState.active
    ? secondary.main
    : primary.dark,
  background: ownerState.active ? primary[50] : 'none',
  border: 'none',
  cursor: ownerState.disabled ? 'not-allowed' : 'pointer',
  transition: 'background-color 100ms ease',
  borderRadius: '4px',

  ...(!ownerState.disabled && !ownerState.active && {
    '&:hover': { background: primary[50] },
  }),
}));

const Empty = styled('div')({
  padding: '12px',
  fontFamily,
  fontSize: '14px',
  color: gray[300],
  textAlign: 'center',
});

const HelperText = styled('span')<{ ownerState: { variant: 'error' | 'warning' | 'success' | 'default' } }>(
  ({ ownerState }) => ({
    fontFamily,
    fontSize: '12px',
    color: ownerState.variant === 'error'   ? error.main
         : ownerState.variant === 'warning' ? orange.dark
         : ownerState.variant === 'success' ? success.main
         : gray[400],
  })
);

// ─── Component ────────────────────────────────────────────────────────────────

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = 'Seleccionar',
  label,
  size = 'large',
  disabled = false,
  searchable = false,
  helperText,
  errorText,
  warningText,
  successText,
  className,
}) => {
  const generatedId = useId();
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const activeValue = value ?? internalValue;
  const selectedOption = options.find((o) => o.value === activeValue);

  const filtered = searchable
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  const hasError   = Boolean(errorText);
  const hasWarning = Boolean(warningText);
  const hasSuccess = Boolean(successText);

  const handleOpen = () => {
    if (disabled) return;
    setOpen((prev) => !prev);
    setSearch('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearch('');
  };

  const handleSelect = (opt: DropdownOption) => {
    if (opt.disabled) return;
    setInternalValue(opt.value);
    onChange?.(opt.value, opt);
    setOpen(false);
    setSearch('');
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open && searchable) searchRef.current?.focus();
  }, [open, searchable]);

  const helperVariant = hasError ? 'error' : hasWarning ? 'warning' : hasSuccess ? 'success' : 'default';
  const helperMessage = errorText ?? warningText ?? successText ?? helperText;

  return (
    <Wrapper ref={containerRef} className={className}>
      {label && <Label htmlFor={generatedId}>{label}</Label>}

      <Trigger
        type="button"
        id={generatedId}
        ownerState={{ size, open, disabled, hasError, hasWarning, hasSuccess }}
        onClick={handleOpen}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selectedOption ? (
          <SelectedText>{selectedOption.label}</SelectedText>
        ) : (
          <PlaceholderText>{placeholder}</PlaceholderText>
        )}

        {/* Warning icon */}
        {hasWarning && !hasError && (
          <IconSlot sx={{ color: orange.dark }}>
            <WarningIcon />
          </IconSlot>
        )}

        {/* Clear button (Typing state — searchable + has search text) */}
        {searchable && open && search.length > 0 && (
          <ClearButton type="button" onClick={handleClear} aria-label="Limpiar búsqueda">
            <XIcon />
          </ClearButton>
        )}

        {/* Search icon (closed) or Chevron */}
        {searchable && !open ? (
          <IconSlot>
            <SearchIcon />
          </IconSlot>
        ) : (
          <IconSlot ownerState={{ open }}>
            <ChevronDown />
          </IconSlot>
        )}
      </Trigger>

      {open && (
        <Menu role="listbox">
          {searchable && (
            <SearchWrapper>
              <SearchInput
                ref={searchRef}
                type="text"
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </SearchWrapper>
          )}
          {filtered.length === 0 ? (
            <Empty>Sin resultados</Empty>
          ) : (
            filtered.map((opt) => (
              <Option
                key={opt.value}
                type="button"
                role="option"
                aria-selected={opt.value === activeValue}
                ownerState={{ active: opt.value === activeValue, disabled: Boolean(opt.disabled) }}
                onClick={() => handleSelect(opt)}
                disabled={opt.disabled}
              >
                <IconSlot sx={{ color: opt.value === activeValue ? secondary.main : gray[400] }}>
                  <ArrowRightIcon />
                </IconSlot>
                {opt.label}
              </Option>
            ))
          )}
        </Menu>
      )}

      {helperMessage && (
        <HelperText ownerState={{ variant: helperVariant }}>{helperMessage}</HelperText>
      )}
    </Wrapper>
  );
};

export default Dropdown;
