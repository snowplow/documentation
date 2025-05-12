import { experimental_extendTheme as extendTheme } from '@mui/material/styles'

// General MUI theme
const extTheme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#6638b8',
        },
        background: {
          default: '#F9FAFB',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#916CE7',
        },
        background: {
          default: '#050505',
        },
      },
    },
  },
})

export default extTheme
