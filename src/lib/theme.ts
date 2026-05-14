import { createTheme } from '@mui/material/styles';
import {
  primary, secondary, quaternary, orange,
  gray, text, error, warning, info, success,
  fontFamily, fontSize, fontWeight, lineHeight,
} from './tokens';

// ─── MUI TypeScript augmentation ─────────────────────────────────────────────
// Adds `quaternary` and `orange` as valid palette keys with full typing.

declare module '@mui/material/styles' {
  interface Palette {
    quaternary: {
      main: string;
      light: string;
      lighter: string;
      ultraLight: string;
    };
    orange: {
      dark: string;
      main: string;
      light: string;
    };
  }
  interface PaletteOptions {
    quaternary?: {
      main?: string;
      light?: string;
      lighter?: string;
      ultraLight?: string;
    };
    orange?: {
      dark?: string;
      main?: string;
      light?: string;
    };
  }
  interface PaletteColor {
    ultraLight?: string;
    lighter?: string;
    50?: string;
  }
  interface SimplePaletteColorOptions {
    ultraLight?: string;
    lighter?: string;
    50?: string;
  }
  interface TypeText {
    primary: string;
    secondary: string;
    disabled: string;
  }
}

// ─── Theme ───────────────────────────────────────────────────────────────────

const theme = createTheme({
  // ── Palette ─────────────────────────────────────────────────────────────────
  palette: {
    primary: {
      dark:        primary.dark,
      main:        primary.main,
      light:       primary.light,
      lighter:     primary.lighter,
      ultraLight:  primary.ultraLight,
      50:          primary[50],
      contrastText: gray.white,
    },
    secondary: {
      main:    secondary.main,
      light:   secondary.light,
      lighter: secondary.lighter,
      contrastText: gray.white,
    },
    quaternary: {
      main:       quaternary.main,
      light:      quaternary.light,
      lighter:    quaternary.lighter,
      ultraLight: quaternary.ultraLight,
    },
    orange: {
      dark:  orange.dark,
      main:  orange.main,
      light: orange.light,
    },
    error: {
      dark:       error.dark,
      main:       error.main,
      light:      error.light,
      ultraLight: error.ultraLight,
    },
    warning: {
      dark:  warning.dark,
      main:  warning.main,
      light: warning.light,
    },
    info: {
      dark:       info.dark,
      main:       info.main,
      light:      info.light,
      ultraLight: info.ultraLight,
    },
    success: {
      dark:       success.dark,
      main:       success.main,
      light:      success.light,
      ultraLight: success.ultraLight,
    },
    text: {
      primary:  text.primary,
      secondary: text.secondary,
      disabled: gray[300],
    },
    grey: {
      100: gray[100],
      200: gray[200],
      300: gray[300],
      400: gray[400],
    },
    background: {
      default: gray.white,
      paper:   gray.white,
    },
  },

  // ── Typography ───────────────────────────────────────────────────────────────
  typography: {
    fontFamily,
    fontSize: fontSize.sm,
    body1: {
      fontFamily,
      fontSize: fontSize.md,
      fontWeight: fontWeight.regular,
      lineHeight,
    },
    body2: {
      fontFamily,
      fontSize: fontSize.sm,
      fontWeight: fontWeight.regular,
      lineHeight,
    },
    h1: {
      fontFamily,
      fontSize: fontSize.xl,
      fontWeight: fontWeight.semiBold,
      lineHeight,
    },
    h3: {
      fontFamily,
      fontSize: fontSize.lg,
      fontWeight: fontWeight.semiBold,
      lineHeight,
    },
    h4: {
      fontFamily,
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      lineHeight,
    },
    button: {
      fontFamily,
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      textTransform: 'none',
      lineHeight: 1,
    },
    caption: {
      fontFamily,
      fontSize: fontSize.xs,
      fontWeight: fontWeight.regular,
      lineHeight,
    },
  },

  // ── Shape ────────────────────────────────────────────────────────────────────
  shape: { borderRadius: 8 },

  // ── Component overrides ──────────────────────────────────────────────────────
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { fontFamily },
      },
    },

    // ── Button ─────────────────────────────────────────────────────────────────
    MuiButton: {
      defaultProps: { disableElevation: true, disableRipple: false },
      styleOverrides: {
        root: {
          borderRadius: '24px',
          fontFamily,
          fontWeight: fontWeight.medium,
          fontSize: fontSize.sm,
          textTransform: 'none',
          lineHeight: 1,
          minWidth: 'auto',
          gap: '4px',
          transition: 'background-color 150ms ease, color 150ms ease, border-color 150ms ease',
          '&:focus-visible': { boxShadow: `0 0 0 3px ${primary[50]}` },
        },
        sizeLarge:  { height: '48px', padding: '0 16px' },
        sizeMedium: { height: '40px', padding: '0 16px' },
        sizeSmall:  { height: '32px', padding: '0 16px' },
        contained: {
          backgroundColor: primary.light,
          color: gray.white,
          boxShadow: 'none',
          '&:hover':        { backgroundColor: primary.dark, boxShadow: 'none' },
          '&.Mui-disabled': { backgroundColor: gray[200], color: gray[300], boxShadow: 'none' },
        },
        outlined: {
          borderColor: primary.light,
          color: primary.light,
          backgroundColor: gray.white,
          '&:hover':        { borderColor: primary.dark, color: primary.dark, backgroundColor: gray.white },
          '&.Mui-disabled': { borderColor: gray[200], color: gray[300] },
        },
        text: {
          color: primary.light,
          '&:hover':        { backgroundColor: primary[50] },
          '&.Mui-disabled': { color: gray[300] },
        },
        startIcon: { marginRight: '4px', marginLeft: 0 },
        endIcon:   { marginLeft: '4px', marginRight: 0 },
      },
    },

    // ── TextField / Input ──────────────────────────────────────────────────────
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'medium', fullWidth: true },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          height: '48px',
          fontFamily,
          fontSize: fontSize.sm,
          fontWeight: fontWeight.regular,
          color: primary.dark,
          backgroundColor: gray.white,
          borderRadius: '8px',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: gray[300], borderWidth: '1px' },
          '&:hover:not(.Mui-disabled):not(.Mui-error) .MuiOutlinedInput-notchedOutline': { borderColor: text.secondary },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline':                               { borderColor: secondary.main, borderWidth: '1.5px' },
          '&.Mui-focused input':                                                           { color: text.primary },
          '&.Mui-error .MuiOutlinedInput-notchedOutline':                                 { borderColor: error.main, borderWidth: '1.5px' },
          '&.Mui-error':                                                                   { backgroundColor: error.ultraLight },
          '&.Mui-disabled':                                                                { backgroundColor: gray[100] },
          '&.Mui-disabled .MuiOutlinedInput-notchedOutline':                              { borderColor: gray[200], borderWidth: '1.5px' },
          '& input::placeholder':                                                          { color: gray[400], opacity: 1 },
          '& input.Mui-disabled':                                                          { color: gray[400], WebkitTextFillColor: gray[400] },
        },
        input: { padding: '8px 16px', height: 'auto' },
        adornedStart: { paddingLeft: '12px' },
        adornedEnd:   { paddingRight: '12px' },
        notchedOutline: {
          '& legend': { display: 'none' },
          top: 0,
        },
      },
    },
    MuiInputLabel: {
      defaultProps: { shrink: true },
      styleOverrides: {
        root: {
          fontFamily,
          fontSize: fontSize.sm,
          fontWeight: fontWeight.regular,
          color: primary.dark,
          position: 'static',
          transform: 'none',
          marginBottom: '8px',
          lineHeight,
          '&.Mui-focused':  { color: primary.dark },
          '&.Mui-error':    { color: primary.dark },
          '&.Mui-disabled': { color: gray[400] },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontFamily,
          fontSize: fontSize.xs,
          fontWeight: fontWeight.regular,
          lineHeight,
          margin: '8px 0 0',
          color: gray[400],
          '&.Mui-error': { color: error.main },
        },
      },
    },

    // ── Checkbox ───────────────────────────────────────────────────────────────
    MuiCheckbox: {
      defaultProps: { disableRipple: false, size: 'medium' },
      styleOverrides: {
        root: {
          padding: '0',
          width: '24px',
          height: '24px',
          borderRadius: '4px',
          border: `1px solid ${gray[400]}`,
          backgroundColor: gray.white,
          color: 'transparent',
          transition: 'border-color 150ms ease, background-color 150ms ease, box-shadow 150ms ease',
          '& .MuiSvgIcon-root': { width: '18px', height: '18px', fill: 'transparent' },
          '&.Mui-checked': {
            backgroundColor: secondary.main,
            borderColor: secondary.main,
            color: gray.white,
            '& .MuiSvgIcon-root': { fill: gray.white },
          },
          '&.MuiCheckbox-indeterminate': {
            backgroundColor: primary.ultraLight,
            borderColor: secondary.main,
            color: secondary.main,
            '& .MuiSvgIcon-root': { fill: secondary.main },
          },
          '&:hover:not(.Mui-disabled)':              { borderColor: secondary.main, backgroundColor: gray.white },
          '&:hover.Mui-checked:not(.Mui-disabled)':  { backgroundColor: secondary.main },
          '&.Mui-focusVisible':                       { boxShadow: `0 0 0 3px ${primary[50]}`, borderColor: secondary.main },
          '&.Mui-disabled':                           { borderColor: gray[300], backgroundColor: gray[100] },
          '&.Mui-disabled.Mui-checked':               { backgroundColor: gray[300], borderColor: gray[300] },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root:  { margin: 0, gap: '8px', alignItems: 'center' },
        label: {
          fontFamily,
          fontSize: fontSize.sm,
          fontWeight: fontWeight.regular,
          lineHeight,
          color: text.secondary,
          '&.Mui-disabled': { color: gray[300] },
        },
      },
    },

    // ── Radio ──────────────────────────────────────────────────────────────────
    MuiRadio: {
      defaultProps: { disableRipple: false, size: 'small' },
      styleOverrides: {
        root: {
          padding: '0',
          width: '16px',
          height: '16px',
          color: gray[400],
          '& .MuiSvgIcon-root':        { width: '16px', height: '16px' },
          '&.Mui-checked':              { color: secondary.main },
          '&:hover:not(.Mui-disabled)': { color: secondary.main },
          '&.Mui-focusVisible':         { boxShadow: `0 0 0 3px ${primary[50]}` },
          '&.Mui-disabled':             { color: gray[300] },
        },
      },
    },

    // ── Switch / Toggle ────────────────────────────────────────────────────────
    MuiSwitch: {
      defaultProps: { disableRipple: false },
      styleOverrides: {
        root: {
          width: '40px',
          height: '22px',
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: '1px',
            top: 0, left: 0,
            '&.Mui-checked': {
              transform: 'translateX(18px)',
              '& + .MuiSwitch-track': { backgroundColor: secondary.main, borderColor: secondary.main, opacity: 1 },
              '& .MuiSwitch-thumb':   { borderColor: secondary.main },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': { boxShadow: `0 0 0 3px ${primary[50]}` },
            '&.Mui-disabled': {
              '& + .MuiSwitch-track': { backgroundColor: gray[100], borderColor: gray[300], opacity: 1 },
              '& .MuiSwitch-thumb':   { backgroundColor: gray[200], borderColor: gray[300] },
            },
          },
          '& .MuiSwitch-thumb': {
            width: '20px',
            height: '20px',
            backgroundColor: gray.white,
            border: `1px solid ${secondary.main}`,
            boxShadow: 'none',
            boxSizing: 'border-box',
          },
          '& .MuiSwitch-track': {
            borderRadius: '19px',
            backgroundColor: gray[200],
            border: `1px solid ${secondary.main}`,
            opacity: 1,
            boxSizing: 'border-box',
          },
        },
        sizeSmall: {
          width: '32px',
          height: '16px',
          '& .MuiSwitch-switchBase': {
            padding: '1px',
            '&.Mui-checked': { transform: 'translateX(16px)' },
          },
          '& .MuiSwitch-thumb': { width: '14px', height: '14px' },
        },
      },
    },

    // ── Chip ───────────────────────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: {
          height: '32px',
          borderRadius: '50px',
          fontFamily,
          fontWeight: fontWeight.regular,
          fontSize: fontSize.xs,
          lineHeight,
          border: `1px solid ${primary.ultraLight}`,
          backgroundColor: gray.white,
          color: primary.dark,
          '&.MuiChip-clickable:hover': { backgroundColor: gray.white },
          '&.Mui-focusVisible':         { boxShadow: `0 0 0 3px ${primary[50]}`, backgroundColor: gray.white },
          '&.Mui-disabled':             { backgroundColor: gray[100], borderColor: gray[200], color: gray[300] },
        },
        label:      { padding: '0 12px' },
        deleteIcon: {
          width: '10px',
          height: '10px',
          color: primary.dark,
          margin: '0 8px 0 -4px',
          '&:hover': { color: primary.dark, opacity: 1 },
        },
      },
    },

    // ── Alert ──────────────────────────────────────────────────────────────────
    MuiAlert: {
      defaultProps: { variant: 'filled', icon: false },
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '16px 16px 16px 24px',
          border: '1px solid',
          borderLeft: '8px solid',
          fontFamily,
          alignItems: 'flex-start',
          flexDirection: 'column',
          gap: '16px',
        },
        message: { padding: 0, display: 'flex', flexDirection: 'column', gap: '4px' },
        action:  { padding: 0, marginLeft: 0, marginRight: 0 },
        // filled variants
        filledInfo:    { backgroundColor: info.ultraLight,    borderColor: info.main,    color: primary.dark },
        filledWarning: { backgroundColor: warning.light,      borderColor: warning.main, color: primary.dark },
        filledError:   { backgroundColor: error.ultraLight,   borderColor: error.main,   color: primary.dark },
        filledSuccess: { backgroundColor: success.ultraLight, borderColor: success.main, color: primary.dark },
        // outlined variants (border style — white bg)
        outlinedInfo:    { backgroundColor: gray.white, borderColor: info.main,    color: primary.dark },
        outlinedWarning: { backgroundColor: gray.white, borderColor: warning.main, color: primary.dark },
        outlinedError:   { backgroundColor: gray.white, borderColor: error.main,   color: primary.dark },
        outlinedSuccess: { backgroundColor: gray.white, borderColor: success.main, color: primary.dark },
      },
    },
    MuiAlertTitle: {
      styleOverrides: {
        root: {
          fontFamily,
          fontSize: fontSize.sm,
          fontWeight: fontWeight.medium,
          lineHeight,
          color: primary.dark,
          margin: 0,
        },
      },
    },

    // ── Tooltip ────────────────────────────────────────────────────────────────
    MuiTooltip: {
      defaultProps: { arrow: true },
      styleOverrides: {
        tooltip: {
          backgroundColor: primary.main,
          fontFamily,
          fontSize: fontSize.sm,
          fontWeight: fontWeight.regular,
          lineHeight,
          padding: '8px 16px',
          borderRadius: '4px',
          maxWidth: '200px',
        },
        arrow: { color: primary.main },
      },
    },

    // ── Tabs ───────────────────────────────────────────────────────────────────
    MuiTabs: {
      styleOverrides: {
        root:         { minHeight: 'auto' },
        indicator:    { height: '4px', backgroundColor: secondary.main },
        flexContainer: { borderBottom: `2px solid ${gray[200]}` },
      },
    },
    MuiTab: {
      defaultProps: { disableRipple: false },
      styleOverrides: {
        root: {
          fontFamily,
          fontSize: fontSize.sm,
          fontWeight: fontWeight.medium,
          textTransform: 'none',
          color: text.primary,
          minHeight: '42px',
          padding: '8px 32px',
          gap: '4px',
          borderRadius: '8px 8px 0 0',
          '&.Mui-selected': { color: secondary.main },
          '&.Mui-disabled': { color: gray[300] },
        },
      },
    },

    // ── Pagination ─────────────────────────────────────────────────────────────
    MuiPagination: {
      defaultProps: { shape: 'rounded', color: 'primary' },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          fontFamily,
          fontSize: fontSize.sm,
          fontWeight: fontWeight.regular,
          color: primary.dark,
          borderRadius: '4px',
          minWidth: 'auto',
          height: '28px',
          padding: '4px 8px',
          margin: '0 2px',
          border: 'none',
          '&:hover':         { backgroundColor: primary[50] },
          '&.Mui-selected':  { backgroundColor: primary.ultraLight, color: secondary.main, fontWeight: fontWeight.medium, '&:hover': { backgroundColor: primary.ultraLight } },
          '&.Mui-disabled':  { color: gray[300] },
        },
        previousNext: { padding: '4px', minWidth: '28px' },
        ellipsis:     { padding: '4px 6px' },
      },
    },

    // ── Select / Dropdown ──────────────────────────────────────────────────────
    MuiSelect: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root:   { borderRadius: '8px' },
        select: {
          fontFamily,
          fontSize: fontSize.sm,
          color: primary.dark,
          padding: '0 12px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          '&:focus': { backgroundColor: 'transparent' },
        },
        icon: { color: gray[400], right: '12px' },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: '8px',
          border: `1px solid ${gray[200]}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          marginTop: '4px',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily,
          fontSize: fontSize.sm,
          fontWeight: fontWeight.regular,
          color: text.secondary,
          padding: '10px 12px',
          '&:hover':       { backgroundColor: gray[100] },
          '&.Mui-selected': {
            backgroundColor: primary[50],
            color: secondary.main,
            fontWeight: fontWeight.medium,
            '&:hover': { backgroundColor: primary[50] },
          },
          '&.Mui-disabled': { color: gray[300] },
        },
      },
    },

    // ── Snackbar / Toast ───────────────────────────────────────────────────────
    MuiSnackbar: {
      defaultProps: { anchorOrigin: { vertical: 'top', horizontal: 'right' } },
      styleOverrides: {
        root: { top: '24px !important', right: '24px !important' },
      },
    },
  },
});

export default theme;
