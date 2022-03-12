import Paper from '@mui/material/Paper';
import { createTheme, responsiveFontSizes, styled } from '@mui/material/styles';

const theme = responsiveFontSizes(createTheme({
  palette: {
    primary: {
      main: '#9f35f5',
    },
  },
  typography: {
    fontFamily: 'Hind,sans-serif',
  },
  shape: {
    borderRadius: 4,
  },
}));

export const darkTheme = responsiveFontSizes(createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9f35f5',
    },
  },
  typography: {
    fontFamily: 'Hind,sans-serif',
  },
  shape: {
    borderRadius: 4,
  },
}));

export const PaperBox = styled(Paper)`
  border-radius:${theme.shape.borderRadius}px;
`;

export default theme;
