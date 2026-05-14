import React from 'react';
import { styled } from '@mui/material/styles';
import { primary, gray, fontFamily, fontSize, fontWeight, lineHeight } from '../../tokens';

export interface ChipProps {
  label: string;
  count?: number;
  selected?: boolean;
  disabled?: boolean;
  onSelect?: (selected: boolean) => void;
  onRemove?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

// ─── Styled Elements ──────────────────────────────────────────────────────────

const ChipRoot = styled('button')<{ ownerState: { selected: boolean; disabled: boolean } }>(
  ({ ownerState: { selected, disabled } }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    height: '32px',
    borderRadius: '50px',
    padding: '4px 12px',
    border: `1px solid ${disabled ? gray[200] : primary.ultraLight}`,
    backgroundColor: disabled ? gray[100] : selected ? primary[50] : gray.white,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily,
    fontSize: `${fontSize.xs}px`,
    fontWeight: fontWeight.regular,
    lineHeight,
    color: disabled ? gray[300] : primary.dark,
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'background-color 150ms ease, border-color 150ms ease',
    '&:focus-visible': {
      boxShadow: `0 0 0 3px ${primary[50]}`,
    },
  })
);

const CountTag = styled('span')<{ ownerState: { selected: boolean; disabled: boolean } }>(
  ({ ownerState: { selected, disabled } }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '0 4px',
    borderRadius: '4px',
    backgroundColor: disabled ? gray[200] : selected ? gray.white : primary.ultraLight,
    fontFamily,
    fontSize: `${fontSize.xs}px`,
    fontWeight: fontWeight.medium,
    lineHeight,
    color: disabled ? gray[300] : primary.dark,
    whiteSpace: 'nowrap',
  })
);

const IconWrapper = styled('span')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 16,
  height: 16,
  flexShrink: 0,
});

const RemoveButton = styled('button')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 16,
  height: 16,
  padding: 0,
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  color: primary.dark,
  flexShrink: 0,
  '&:focus-visible': { outline: `2px solid ${primary.light}` },
});

const XIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
    <path d="M2 2l6 6M8 2L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

export const Chip: React.FC<ChipProps> = ({
  label,
  count,
  selected = false,
  disabled = false,
  onSelect,
  onRemove,
  icon,
  className,
}) => {
  const ownerState = { selected, disabled };

  const handleClick = () => {
    if (!disabled && onSelect) onSelect(!selected);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && onRemove) onRemove();
  };

  return (
    <ChipRoot
      ownerState={ownerState}
      onClick={handleClick}
      disabled={disabled}
      aria-pressed={onSelect ? selected : undefined}
      className={className}
      type="button"
    >
      {icon && <IconWrapper>{icon}</IconWrapper>}

      <span>{label}</span>

      {count !== undefined && (
        <CountTag ownerState={ownerState}>{count}</CountTag>
      )}

      {selected && !disabled && (
        <RemoveButton
          type="button"
          onClick={handleRemove}
          aria-label="Eliminar"
        >
          <XIcon />
        </RemoveButton>
      )}
    </ChipRoot>
  );
};

export default Chip;
