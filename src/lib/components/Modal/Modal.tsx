import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { styled } from '@mui/material/styles';
import {
  primary, secondary, gray, text,
  fontFamily, fontWeight,
} from '../../tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ModalHeaderState = 'header' | 'only-close' | 'none';

export interface ModalAction {
  /** Button label */
  label: string;
  /** ghost renders on the left · outlined and primary render on the right */
  variant: 'ghost' | 'outlined' | 'primary';
  /** Optional icon rendered before the label */
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export interface ModalProps {
  /** Controls modal visibility */
  open: boolean;
  /** Called on ESC, backdrop click, or the X button */
  onClose?: () => void;
  /** Modal title — visible when headerState="header" */
  title?: string;
  /** Supporting description below the title — visible when headerState="header" */
  description?: string;
  /** Slot content rendered between header and footer */
  children?: React.ReactNode;
  /** Footer buttons. ghost → left · outlined / primary → right */
  actions?: ModalAction[];
  /**
   * Header layout:
   * - `header`     — title + description + X close button
   * - `only-close` — X close button only
   * - `none`       — no header
   */
  headerState?: ModalHeaderState;
  /** Max width of the modal card. Default: 800px */
  maxWidth?: number | string;
  /** When true, clicking the backdrop does NOT close the modal */
  disableBackdropClose?: boolean;
  /** Additional CSS class for the modal card */
  className?: string;
}

// ─── Focusable selector ───────────────────────────────────────────────────────

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// ─── Icon ─────────────────────────────────────────────────────────────────────

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// ─── Styled Components ────────────────────────────────────────────────────────

const Backdrop = styled('div')({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(33, 40, 177, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1300,
  padding: '24px',
  animation: 'backdropIn 200ms ease forwards',
  '@keyframes backdropIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
});

const Container = styled('div')<{ ownerState: { maxWidth: string } }>(
  ({ ownerState }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minWidth: '400px',
    maxWidth: ownerState.maxWidth,
    backgroundColor: gray.white,
    borderRadius: '16px',
    boxShadow: '0px 8px 32px rgba(6, 7, 53, 0.16)',
    outline: 'none',
    animation: 'modalIn 200ms ease forwards',
    '@keyframes modalIn': {
      from: { opacity: 0, transform: 'scale(0.96) translateY(-8px)' },
      to: { opacity: 1, transform: 'scale(1) translateY(0)' },
    },
  })
);

const Header = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '32px 32px 16px',
  borderRadius: '16px 16px 0 0',
  backgroundColor: gray.white,
});

// X right-aligned; title below takes full width
const HeaderInner = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '4px',
  width: '100%',
});

const CloseButton = styled('button')({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  padding: 0,
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  color: secondary.main,
  flexShrink: 0,
  borderRadius: '4px',
  '&:focus-visible': {
    outline: `2px solid ${secondary.main}`,
    outlineOffset: '2px',
  },
});

const Title = styled('p')({
  fontFamily,
  fontWeight: fontWeight.semiBold,
  fontSize: '20px',
  lineHeight: 1.4,
  color: primary.dark,
  margin: 0,
  width: '100%',
  textAlign: 'left',
});

const Description = styled('p')({
  fontFamily,
  fontWeight: fontWeight.regular,
  fontSize: '14px',
  lineHeight: 1.4,
  color: text.secondary,
  margin: 0,
  width: '100%',
});

const Body = styled('div')({
  backgroundColor: gray.white,
  padding: '0 32px',
});

const Footer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '24px 32px 32px',
  borderRadius: '0 0 16px 16px',
  backgroundColor: gray.white,
});

const FooterRight = styled('div')({
  display: 'flex',
  gap: '16px',
  alignItems: 'center',
  marginLeft: 'auto',
});

const ActionButton = styled('button')<{
  ownerState: { variant: 'ghost' | 'outlined' | 'primary' };
}>(({ ownerState }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4px',
  height: '40px',
  minWidth: '50px',
  padding: '10px 16px',
  borderRadius: '24px',
  fontFamily,
  fontWeight: fontWeight.medium,
  fontSize: '14px',
  lineHeight: 1,
  cursor: 'pointer',
  transition: 'background-color 150ms ease, border-color 150ms ease',
  outline: 'none',
  whiteSpace: 'nowrap',
  '&:focus-visible': {
    outline: `2px solid ${secondary.main}`,
    outlineOffset: '2px',
  },

  ...(ownerState.variant === 'ghost' && {
    background: 'transparent',
    border: 'none',
    color: primary.light,
    '&:hover:not(:disabled)': { background: primary[50] },
    '&:disabled': { color: gray[300], cursor: 'not-allowed' },
  }),

  ...(ownerState.variant === 'outlined' && {
    background: gray.white,
    border: `1px solid ${primary.light}`,
    color: primary.light,
    '&:hover:not(:disabled)': { background: primary[50] },
    '&:disabled': { borderColor: gray[300], color: gray[300], cursor: 'not-allowed' },
  }),

  ...(ownerState.variant === 'primary' && {
    background: primary.light,
    border: 'none',
    color: gray.white,
    '&:hover:not(:disabled)': { background: secondary.main },
    '&:disabled': { background: gray[200], color: gray[300], cursor: 'not-allowed' },
  }),
}));

// ─── Component ────────────────────────────────────────────────────────────────

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  actions = [],
  headerState = 'header',
  maxWidth = '800px',
  disableBackdropClose = false,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Save and restore focus
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    } else {
      previousFocusRef.current?.focus();
    }
  }, [open]);

  // Auto-focus first focusable element when opened
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      const first = containerRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      first?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  // Focus trap — keep Tab/Shift+Tab inside the modal
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.();
        return;
      }
      if (e.key !== 'Tab') return;

      const focusable = Array.from(
        containerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  // Prevent body scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  const maxWidthStr = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;
  const ghostActions = actions.filter((a) => a.variant === 'ghost');
  const rightActions = actions.filter((a) => a.variant !== 'ghost');

  return createPortal(
    <Backdrop
      role="presentation"
      onClick={(e) => {
        if (!disableBackdropClose && e.target === e.currentTarget) onClose?.();
      }}
    >
      <Container
        ref={containerRef}
        ownerState={{ maxWidth: maxWidthStr }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-desc' : undefined}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={className}
      >
        {/* ── Header ── */}
        {headerState !== 'none' && (
          <Header>
            <HeaderInner>
              <CloseButton type="button" onClick={onClose} aria-label="Cerrar">
                <CloseIcon />
              </CloseButton>
              {headerState === 'header' && title && (
                <Title id="modal-title">{title}</Title>
              )}
            </HeaderInner>
            {headerState === 'header' && description && (
              <Description id="modal-desc">{description}</Description>
            )}
          </Header>
        )}

        {/* ── Slot / Body ── */}
        {children && <Body>{children}</Body>}

        {/* ── Footer ── */}
        {actions.length > 0 && (
          <Footer>
            {ghostActions.length > 0 && (
              <div style={{ display: 'flex', gap: '8px' }}>
                {ghostActions.map((action, i) => (
                  <ActionButton
                    key={i}
                    type="button"
                    ownerState={{ variant: 'ghost' }}
                    onClick={action.onClick}
                    disabled={action.disabled}
                  >
                    {action.icon}
                    {action.label}
                  </ActionButton>
                ))}
              </div>
            )}
            <FooterRight>
              {rightActions.map((action, i) => (
                <ActionButton
                  key={i}
                  type="button"
                  ownerState={{ variant: action.variant }}
                  onClick={action.onClick}
                  disabled={action.disabled}
                >
                  {action.icon}
                  {action.label}
                </ActionButton>
              ))}
            </FooterRight>
          </Footer>
        )}
      </Container>
    </Backdrop>,
    document.body
  );
};

export default Modal;
