import React from 'react';
import styles from './Tooltip.module.css';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /** Text shown as the main description */
  description: string;
  /** Optional bold title above the description */
  title?: string;
  /** Where the arrow points — relative to the trigger element */
  placement?: TooltipPlacement;
  /** Label for the CTA button. If omitted, button is hidden */
  ctaLabel?: string;
  /** Callback when the CTA button is clicked */
  onCtaClick?: () => void;
  /** Show the X close button */
  showClose?: boolean;
  /** Callback when the close button is clicked */
  onClose?: () => void;
  /** Additional CSS class */
  className?: string;
}

const CloseIcon: React.FC = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M1 1L9 9M9 1L1 9"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const Tooltip: React.FC<TooltipProps> = ({
  description,
  title,
  placement = 'top',
  ctaLabel,
  onCtaClick,
  showClose = true,
  onClose,
  className,
}) => {
  const rootClass = [
    styles.root,
    styles[placement],
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const bubble = (
    <div className={styles.bubble}>
      {/* Content row */}
      <div className={styles.content}>
        <div className={styles.info}>
          {title && <p className={styles.title}>{title}</p>}
          <p className={styles.description}>{description}</p>
          {ctaLabel && (
            <button
              type="button"
              className={styles.cta}
              onClick={onCtaClick}
            >
              {ctaLabel}
            </button>
          )}
        </div>

        {showClose && (
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Cerrar tooltip"
          >
            <CloseIcon />
          </button>
        )}
      </div>
    </div>
  );

  const arrow = <div className={styles.arrow} aria-hidden="true" />;

  return (
    <div className={rootClass} role="tooltip">
      {/* Arrow goes before bubble on bottom/right placements */}
      {(placement === 'bottom' || placement === 'right') && arrow}
      {bubble}
      {(placement === 'top' || placement === 'left') && arrow}
    </div>
  );
};

export default Tooltip;
