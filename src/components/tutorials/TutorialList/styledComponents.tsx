import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Search } from '@mui/icons-material'
import {
  Box,
  Chip,
  FormControl,
  OutlinedInput,
  Paper,
  styled,
  Typography,
} from '@mui/material'
import { grey } from '@mui/material/colors'

const tutorialTheme = {
  darkPurple: '#2F1A55',
  lightPurple: '#D4C7EB',
  snowplowPurple: '#6638b8',
  checkboxGreen: '#039855',
}

const cssVar = {
  MuiPaletteBackgroundPaper: 'var(--mui-palette-background-paper)',
  MuiPaletteTextPrimary: 'var(--mui-palette-text-primary)',
}

export const Grid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(390px, 1fr))',
  columnGap: theme.spacing(2),
  rowGap: theme.spacing(2),
  gridAutoRows: 'minmax(204px, 1fr)',
}))

export const Card = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  flexDirection: 'column',
  transition: 'all 0.15s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    boxShadow: '0px 4px 12px 0px rgba(16, 24, 40, 0.15), 0px 0px 0px 1px rgba(102, 56, 184, 0.12)',
  },
}))

export const Title = styled(Box)(({ theme }) => ({
  fontSize: theme.typography.h5.fontSize,
}))

export const Topic = styled(Chip)(({ theme }) => ({
  color: tutorialTheme.darkPurple,
  backgroundColor: tutorialTheme.lightPurple,
  borderRadius: '4px',
  height: '25px',
  fontSize: 'label',
}))

export const Description = styled(Box)(({ theme }) => ({
  fontSize: theme.typography.body2.fontSize,
  display: ['block', '-webkit-box'], // First fallback to "block" if "-webkit-box" is not supported
  WebkitLineClamp: '3',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}))

const shadow =
  '0px 0px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.1);'

export const SearchBarInput = styled(OutlinedInput)(({ theme }) => ({
  backgroundColor: cssVar.MuiPaletteBackgroundPaper,
  color: cssVar.MuiPaletteTextPrimary,
  boxShadow: shadow,
  height: '44px',
}))

export const SearchBarFormControl = styled(FormControl)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(4),
}))

export const TopicFilterSidebar = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: cssVar.MuiPaletteBackgroundPaper,
  borderRadius: theme.spacing(1),
  border: '1px solid ' + grey[200],
  boxShadow: shadow,
  position: 'sticky',
  top: theme.spacing(2),
  height: 'fit-content',
}))

export const SnowplowPurpleSearchIcon = styled(Search)(({ theme }) => ({
  color: 'rgba(102, 56, 184, 1)',
}))

export const TutorialCardTitle = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  marginBottom: theme.spacing(1),
}))

export const TutorialTitle = styled(Typography)(({ theme }) => ({
  fontSize: '28px',
}))

export const GreenFontAwesomeIcon = styled(FontAwesomeIcon)(({ theme }) => ({
  color: tutorialTheme.checkboxGreen,
}))
