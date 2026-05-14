import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { primary, gray, fontFamily } from '../../tokens';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface SidebarProps {
  items: SidebarItem[];
  activeId?: string;
  logo?: React.ReactNode;
  className?: string;
}

// ─── Styled components ───────────────────────────────────────────────────────

const SidebarContainer = styled('aside')({
  display: 'flex',
  flexDirection: 'column',
  gap: '40px',
  alignItems: 'center',
  width: '56px',
  minWidth: '56px',
  maxWidth: '56px',
  height: '100%',
  backgroundColor: primary.dark,
  padding: '16px 8px',
  borderTopRightRadius: '16px',
  boxSizing: 'border-box',
  position: 'relative',
});

const LogoArea = styled('div')({
  width: '40px',
  height: '30px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  color: gray.white,
  '& img, & svg': { width: '100%', height: '100%', objectFit: 'contain' },
});

const Nav = styled('nav')({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  alignItems: 'center',
  width: '100%',
});

const ItemWrapper = styled('div')({
  position: 'relative',
  width: '40px',
});

interface StyledItemProps {
  'data-active'?: boolean;
}

const itemBaseStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  padding: '10px',
  borderRadius: '8px',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  color: gray.white,
  transition: 'background-color 150ms ease',
  boxSizing: 'border-box' as const,
  textDecoration: 'none',
};

const StyledButton = styled('button')<StyledItemProps>(({ 'data-active': isActive }) => ({
  ...itemBaseStyles,
  ...(isActive
    ? {
        backgroundColor: gray.white,
        color: primary.dark,
        '& span': { color: primary.dark },
        '&:hover': { backgroundColor: gray.white },
      }
    : {
        '&:hover': { backgroundColor: primary.light },
      }),
}));

const StyledAnchor = styled('a')<StyledItemProps>(({ 'data-active': isActive }) => ({
  ...itemBaseStyles,
  ...(isActive
    ? {
        backgroundColor: gray.white,
        color: primary.dark,
        '& span': { color: primary.dark },
        '&:hover': { backgroundColor: gray.white },
      }
    : {
        '&:hover': { backgroundColor: primary.light },
      }),
}));

const IconSpan = styled('span')({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  flexShrink: 0,
  color: gray.white,
  '& svg': { width: '24px', height: '24px' },
});

const Tooltip = styled('div')({
  position: 'absolute',
  left: 'calc(100% + 8px)',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: gray.white,
  color: primary.dark,
  fontFamily,
  fontSize: '12px',
  fontWeight: 400,
  lineHeight: 1.4,
  whiteSpace: 'nowrap',
  padding: '4px 8px',
  borderRadius: '4px',
  pointerEvents: 'none',
  zIndex: 100,
  boxShadow: `0 2px 8px rgba(6, 7, 53, 0.15)`,
  '&::before': {
    content: '""',
    position: 'absolute',
    right: '100%',
    top: '50%',
    transform: 'translateY(-50%)',
    border: '5px solid transparent',
    borderRightColor: gray.white,
  },
});

// ─── Component ───────────────────────────────────────────────────────────────

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  activeId,
  logo,
  className,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <SidebarContainer className={className} aria-label="Navegación lateral">
      {logo && <LogoArea>{logo}</LogoArea>}
      <Nav>
        {items.map((item) => {
          const isActive = item.id === activeId;
          const isHovered = item.id === hoveredId;

          const sharedProps = {
            'data-active': isActive || undefined,
            'aria-current': isActive ? ('page' as const) : undefined,
            'aria-label': item.label,
            onClick: item.onClick,
            onMouseEnter: () => setHoveredId(item.id),
            onMouseLeave: () => setHoveredId(null),
          };

          return (
            <ItemWrapper key={item.id}>
              {isHovered && <Tooltip role="tooltip">{item.label}</Tooltip>}
              {item.href ? (
                <StyledAnchor href={item.href} {...sharedProps}>
                  <IconSpan>{item.icon}</IconSpan>
                </StyledAnchor>
              ) : (
                <StyledButton type="button" {...sharedProps}>
                  <IconSpan>{item.icon}</IconSpan>
                </StyledButton>
              )}
            </ItemWrapper>
          );
        })}
      </Nav>
    </SidebarContainer>
  );
};

export default Sidebar;
