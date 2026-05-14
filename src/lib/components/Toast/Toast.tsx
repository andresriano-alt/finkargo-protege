import React from 'react';
import { styled } from '@mui/material/styles';
import {
  primary, secondary, text,
  error, warning, info, success,
  fontFamily,
} from '../../tokens';

export type ToastVariant = 'success' | 'info' | 'error' | 'warning';

export interface ToastProps {
  variant?: ToastVariant;
  title?: string;
  message?: string;
  showBorder?: boolean;
  showIcon?: boolean;
  onClose?: () => void;
  className?: string;
}

// ─── Variant tokens ────────────────────────────────────────────────────────

const variantBg: Record<ToastVariant, string> = {
  success: success.ultraLight,
  info:    info.ultraLight,
  error:   error.ultraLight,
  warning: warning.light,
};

const variantBorderColor: Record<ToastVariant, string> = {
  success: success.main,
  info:    info.main,
  error:   error.main,
  warning: warning.main,
};

// ─── Icons (exact FA Pro paths from Figma) ─────────────────────────────────

const SuccessIcon = () => (
  <svg width="18" height="18" viewBox="0 0 17.25 17.25" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M7.92759 11.162C7.7187 11.3742 7.37505 11.3742 7.16616 11.162L5.00991 9.00571C4.79766 8.79683 4.79766 8.45317 5.00991 8.24429C5.2188 8.03203 5.56245 8.03203 5.77134 8.24429L7.54688 10.0198L11.4787 6.08804C11.6875 5.87578 12.0312 5.87578 12.2401 6.08804C12.4523 6.29692 12.4523 6.64058 12.2401 6.84946L7.92759 11.162ZM17.25 8.625C17.25 13.389 13.389 17.25 8.625 17.25C3.86104 17.25 0 13.389 0 8.625C0 3.86104 3.86104 0 8.625 0C13.389 0 17.25 3.86104 17.25 8.625ZM8.625 1.07812C4.45737 1.07812 1.07812 4.45737 1.07812 8.625C1.07812 12.7926 4.45737 16.1719 8.625 16.1719C12.7926 16.1719 16.1719 12.7926 16.1719 8.625C16.1719 4.45737 12.7926 1.07812 8.625 1.07812Z" fill="#2CA14D" />
  </svg>
);

const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 17.25 17.25" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M8.625 0C3.86104 0 0 3.86104 0 8.625C0 13.389 3.86104 17.25 8.625 17.25C13.389 17.25 17.25 13.389 17.25 8.625C17.25 3.86104 13.389 0 8.625 0ZM8.625 16.1719C4.46411 16.1719 1.07812 12.7859 1.07812 8.625C1.07812 4.46411 4.46411 1.07812 8.625 1.07812C12.7859 1.07812 16.1719 4.46411 16.1719 8.625C16.1719 12.7859 12.7859 16.1719 8.625 16.1719ZM8.625 6.19922C9.07141 6.19922 9.43359 5.83737 9.43359 5.39062C9.43359 4.94421 9.07141 4.58203 8.625 4.58203C8.17859 4.58203 7.81641 4.94253 7.81641 5.39062C7.81641 5.83872 8.1769 6.19922 8.625 6.19922ZM10.2422 11.8594H9.16406V8.08594C9.16406 7.78945 8.92148 7.54688 8.625 7.54688H7.54688C7.25039 7.54688 7.00781 7.78945 7.00781 8.08594C7.00781 8.38242 7.25039 8.625 7.54688 8.625H8.08594V11.8594H7.00781C6.71133 11.8594 6.46875 12.102 6.46875 12.3984C6.46875 12.6949 6.71133 12.9375 7.00781 12.9375H10.2422C10.5399 12.9375 10.7812 12.6961 10.7812 12.3984C10.7812 12.102 10.5387 11.8594 10.2422 11.8594Z" fill="#0094FF" />
  </svg>
);

const ErrorIcon = () => (
  <svg width="18" height="18" viewBox="0 0 17.25 17.25" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M6.08804 6.08804C6.29692 5.87578 6.64058 5.87578 6.84946 6.08804L8.625 7.86357L10.4005 6.08804C10.6094 5.87578 10.9531 5.87578 11.162 6.08804C11.3742 6.29692 11.3742 6.64058 11.162 6.84946L9.38643 8.625L11.162 10.4005C11.3742 10.6094 11.3742 10.9531 11.162 11.162C10.9531 11.3742 10.6094 11.3742 10.4005 11.162L8.625 9.38643L6.84946 11.162C6.64058 11.3742 6.29692 11.3742 6.08804 11.162C5.87578 10.9531 5.87578 10.6094 6.08804 10.4005L7.86357 8.625L6.08804 6.84946C5.87578 6.64058 5.87578 6.29692 6.08804 6.08804ZM17.25 8.625C17.25 13.389 13.389 17.25 8.625 17.25C3.86104 17.25 0 13.389 0 8.625C0 3.86104 3.86104 0 8.625 0C13.389 0 17.25 3.86104 17.25 8.625ZM8.625 1.07812C4.45737 1.07812 1.07812 4.45737 1.07812 8.625C1.07812 12.7926 4.45737 16.1719 8.625 16.1719C12.7926 16.1719 16.1719 12.7926 16.1719 8.625C16.1719 4.45737 12.7926 1.07812 8.625 1.07812Z" fill="#CC071E" />
  </svg>
);

const WarningIcon = () => (
  <svg width="18" height="18" viewBox="0 0 15.9937 15.9937" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M5.98125 1C5.65 1 5.33125 1.13125 5.09687 1.36563L1.36563 5.09687C1.13125 5.33125 1 5.65 1 5.98125V10.0125C1 10.3437 1.13125 10.6625 1.36563 10.8969L0.659375 11.6031C0.2375 11.1812 0 10.6094 0 10.0125V5.98125C0 5.38437 0.2375 4.8125 0.659375 4.39062L4.39062 0.659375C4.8125 0.2375 5.38437 0 5.98125 0H10.0125C10.6094 0 11.1812 0.2375 11.6031 0.659375L15.3344 4.39062C15.7562 4.8125 15.9937 5.38437 15.9937 5.98125V10.0125C15.9937 10.6094 15.7562 11.1812 15.3344 11.6031L11.6031 15.3344C11.1812 15.7562 10.6094 15.9937 10.0125 15.9937H5.98125C5.38437 15.9937 4.8125 15.7562 4.39062 15.3344L0.659375 11.6031L1.36563 10.8969L5.09687 14.6281C5.33125 14.8625 5.65 14.9937 5.98125 14.9937H10.0125C10.3437 14.9937 10.6625 14.8625 10.8969 14.6281L14.6281 10.8969C14.8625 10.6625 14.9937 10.3437 14.9937 10.0125V5.98125C14.9937 5.65 14.8625 5.33125 14.6281 5.09687L10.8969 1.36563C10.6625 1.13125 10.3437 1 10.0125 1H5.98125ZM7.99687 3.99688C8.27187 3.99688 8.49687 4.22187 8.49687 4.49687V8.49687C8.49687 8.77187 8.27187 8.99687 7.99687 8.99687C7.72187 8.99687 7.49687 8.77187 7.49687 8.49687V4.49687C7.49687 4.22187 7.72187 3.99688 7.99687 3.99688ZM7.24687 10.9969C7.24687 10.798 7.32589 10.6072 7.46654 10.4665C7.6072 10.3259 7.79796 10.2469 7.99687 10.2469C8.19579 10.2469 8.38655 10.3259 8.5272 10.4665C8.66786 10.6072 8.74687 10.798 8.74687 10.9969C8.74687 11.1958 8.66786 11.3866 8.5272 11.5272C8.38655 11.6679 8.19579 11.7469 7.99687 11.7469C7.79796 11.7469 7.6072 11.6679 7.46654 11.5272C7.32589 11.3866 7.24687 11.1958 7.24687 10.9969Z" fill="#F9B43A" />
  </svg>
);

// Close icon — secondary.main per Figma
const CloseIcon = () => (
  <svg width="11" height="17" viewBox="0 0 10.7812 17.25" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M10.6229 13.8573C10.4122 14.0679 10.0714 14.0679 9.86047 13.8573L5.39063 9.38642L0.919777 13.8573C0.709105 14.0679 0.368249 14.0679 0.157341 13.8573C-0.0533319 13.6466 -0.0533319 13.3057 0.157341 13.0948L4.6292 8.625L0.158014 4.15415C-0.052658 3.94348 -0.052658 3.60262 0.158014 3.39171C0.368687 3.18104 0.709543 3.18104 0.920451 3.39171L5.39063 7.86357L9.86148 3.39272C10.0721 3.18205 10.413 3.18205 10.6239 3.39272C10.8346 3.6034 10.8346 3.94425 10.6239 4.15516L6.15205 8.625L10.6229 13.0958C10.8352 13.3047 10.8352 13.6484 10.6229 13.8573Z" fill="#3C47D3" />
  </svg>
);

const variantIcons: Record<ToastVariant, React.ReactNode> = {
  success: <SuccessIcon />,
  info:    <InfoIcon />,
  error:   <ErrorIcon />,
  warning: <WarningIcon />,
};

// ─── Styled components ─────────────────────────────────────────────────────

const ToastRoot = styled('div')<{
  ownerState: { variant: ToastVariant; showBorder: boolean };
}>(({ ownerState }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '16px',
  borderRadius: '8px',
  width: '100%',
  maxWidth: '373px',
  boxSizing: 'border-box',
  backgroundColor: variantBg[ownerState.variant],
  border: ownerState.showBorder
    ? `1px solid ${variantBorderColor[ownerState.variant]}`
    : 'none',
}));

const Row = styled('div')({
  display: 'flex',
  flex: 1,
  gap: '4px',
  alignItems: 'flex-start',
  minWidth: 0,
});

const NotificationText = styled('div')({
  display: 'flex',
  flex: 1,
  gap: '8px',
  alignItems: 'flex-start',
  minWidth: 0,
});

const IconWrapper = styled('span')({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '24px',
  height: '24px',
});

const TextGroup = styled('div')({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  gap: '4px',
  minWidth: 0,
});

const Title = styled('p')({
  fontFamily,
  fontSize: '14px',
  fontWeight: 500,
  color: primary.dark,
  lineHeight: 1.4,
  margin: 0,
});

const Message = styled('p')({
  fontFamily,
  fontSize: '14px',
  fontWeight: 400,
  color: text.secondary,
  lineHeight: 1.4,
  margin: 0,
});

const CloseButton = styled('button')({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '24px',
  height: '24px',
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  borderRadius: '4px',
  transition: 'opacity 150ms ease',
  '&:hover': { opacity: 0.7 },
});

// ─── Component ─────────────────────────────────────────────────────────────

export const Toast: React.FC<ToastProps> = ({
  variant = 'success',
  title,
  message,
  showBorder = true,
  showIcon = true,
  onClose,
  className,
}) => (
  <ToastRoot
    ownerState={{ variant, showBorder }}
    role="status"
    aria-live="polite"
    className={className}
  >
    <Row>
      <NotificationText>
        {showIcon && (
          <IconWrapper aria-hidden="true">{variantIcons[variant]}</IconWrapper>
        )}
        <TextGroup>
          {title && <Title>{title}</Title>}
          {message && <Message>{message}</Message>}
        </TextGroup>
      </NotificationText>
      {onClose && (
        <CloseButton type="button" onClick={onClose} aria-label="Cerrar">
          <CloseIcon />
        </CloseButton>
      )}
    </Row>
  </ToastRoot>
);

export default Toast;
