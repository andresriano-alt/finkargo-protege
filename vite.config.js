import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'finkargo-design-system': new URL('../finkargo-design-system/src', import.meta.url).pathname,
    },
  },
  optimizeDeps: {
    include: [
      '@mui/material',
      '@mui/material/Switch',
      '@mui/material/FormControlLabel',
      '@mui/material/Radio',
      '@mui/material/RadioGroup',
      '@mui/material/OutlinedInput',
      '@mui/material/InputAdornment',
      '@mui/material/FormHelperText',
      '@mui/material/Alert',
      '@mui/material/AlertTitle',
      '@mui/material/Button',
      '@mui/material/Box',
      '@mui/material/styles',
      '@emotion/react',
      '@emotion/styled',
    ],
  },
})
