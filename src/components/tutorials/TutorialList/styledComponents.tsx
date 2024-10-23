import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Search } from '@mui/icons-material'
import {
  Box,
  Button,
  Chip,
  FormControl,
  OutlinedInput,
  Paper,
  Select,
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
  gridTemplateColumns: 'repeat(auto-fill, minMax(390px, 1fr))',
  columnGap: theme.spacing(2),
  rowGap: theme.spacing(2),
  gridAutoRows: 'minMax(204px, 1fr)',
}))

export const Card = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  flexDirection: 'column',
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
  marginBottom: theme.spacing(2),
  display: ['block', '-webkit-box'], // First fallback to "block" if "-webkit-box" is not supported
  WebkitLineClamp: '2',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}))

const shadow =
  '0px 0px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.1);'

export const StartButton = styled(Button)(({ theme }) => ({
  color: 'var(--mui-palette-text-primary)',
  textTransform: 'none',
  border: '1px solid ' + grey[300],
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
}))

export const SearchBarInput = styled(OutlinedInput)(({ theme }) => ({
  backgroundColor: cssVar.MuiPaletteBackgroundPaper,
  color: cssVar.MuiPaletteTextPrimary,
  boxShadow: shadow,
  height: '44px',
}))

export const TopicFilterFormControl = styled(FormControl)(({ theme }) => ({
  border: grey[300],
  boxShadow: shadow,
  width: '12rem',
  mb: theme.spacing(4),
}))

export const SearchBarFormControl = styled(FormControl)(({ theme }) => ({
  width: '22rem',
  marginBottom: theme.spacing(4),
}))

export const TopicFilterSelect = styled(Select)(({ theme }) => ({
  backgroundColor: cssVar.MuiPaletteBackgroundPaper,
  color: cssVar.MuiPaletteTextPrimary,
  height: '44px',
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
