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
          default: '#f2f4f7',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#6638b8',
        },
        background: {
          default: '#f2f4f7',
        },
      },
    },
  },
})

export default extTheme
