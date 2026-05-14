import React from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import {
  primary, gray,
  error, warning, info, success,
  fontFamily,
} from '../../tokens';

export type BannerVariant = 'info' | 'warning' | 'success' | 'error';

export interface BannerProps {
  variant?: BannerVariant;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  showIcon?: boolean;
  className?: string;
}

// ---------- Variant tokens ----------
const variantBorderColor: Record<BannerVariant, string> = {
  info:    info.main,
  warning: warning.main,
  success: success.main,
  error:   error.main,
};

// ---------- Icons ----------
const InfoIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="9" cy="9" r="8" stroke={info.main} strokeWidth="1.5" />
    <path d="M9 8v4M9 5.5v.5" stroke={info.main} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const WarningIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M9 1.5L16.5 15H1.5L9 1.5z" stroke={warning.main} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M9 7v4M9 12.5v.5" stroke={warning.main} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const SuccessIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="9" cy="9" r="8" stroke={success.main} strokeWidth="1.5" />
    <path d="M5.5 9l2.5 2.5 4.5-4.5" stroke={success.main} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ErrorIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="9" cy="9" r="8" stroke={error.main} strokeWidth="1.5" />
    <path d="M6 6l6 6M12 6l-6 6" stroke={error.main} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const icons: Record<BannerVariant, React.ReactNode> = {
  info:    <InfoIcon />,
  warning: <WarningIcon />,
  success: <SuccessIcon />,
  error:   <ErrorIcon />,
};

// ---------- Styled components ----------
interface BannerRootProps {
  ownerState: { variant: BannerVariant };
}

const BannerRoot = styled(Box)<BannerRootProps>(({ ownerState }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8px',
  padding: '16px',
  width: '100%',
  boxSizing: 'border-box',
  backgroundColor: gray.white,
  borderRadius: '8px',
  borderLeft: `8px solid ${variantBorderColor[ownerState.variant]}`,
  overflow: 'hidden',
  boxShadow: `0px 10px 30px 0px rgba(108,109,140,0.1)`,
}));

const IconWrapper = styled(Box)({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  flexShrink: 0,
  '& svg': { width: '18px', height: '18px' },
});

const Content = styled(Box)({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});

const TextContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  fontSize: '14px',
  lineHeight: 1.4,
});

const Title = styled('p')({
  fontFamily,
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.4,
  color: primary.dark,
  margin: 0,
});

const Description = styled('p')({
  fontFamily,
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: 1.4,
  color: gray[400],
  margin: 0,
});

const ActionButton = styled('button')({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '32px',
  padding: '0 16px',
  backgroundColor: gray.white,
  border: `1px solid ${primary.light}`,
  borderRadius: '24px',
  fontFamily,
  fontSize: '14px',
  fontWeight: 500,
  color: primary.light,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'background-color 150ms ease',
  alignSelf: 'flex-start',
  outline: 'none',
  '&:hover': { backgroundColor: primary[50] },
  '&:focus-visible': { boxShadow: `0 0 0 3px ${primary[50]}` },
});

// ---------- Component ----------
export const Banner: React.FC<BannerProps> = ({
  variant = 'info',
  title,
  description,
  actionLabel,
  onAction,
  showIcon = true,
  className,
}) => (
  <BannerRoot ownerState={{ variant }} role="status" className={className}>
    {showIcon && <IconWrapper>{icons[variant]}</IconWrapper>}
    <Content>
      <TextContainer>
        {title && <Title>{title}</Title>}
        {description && <Description>{description}</Description>}
      </TextContainer>
      {actionLabel && (
        <ActionButton type="button" onClick={onAction}>
          {actionLabel}
        </ActionButton>
      )}
    </Content>
  </BannerRoot>
);

export default Banner;
