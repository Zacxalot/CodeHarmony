import React from 'react';
import { ThemeProvider } from '@emotion/react';
import ReactDOM from 'react-dom';
import './index.css';
import { Stack } from '@mui/material';
import { Provider } from 'react-redux';
import Hub from './Pages/Hub/Hub';
import { store } from './Redux/store';
import { lightTheme, darkTheme } from './Theme';
import { useAppSelector } from './Redux/hooks';

function ThemePicker() {
  const selectedTheme = useAppSelector(({ themeSelector: { theme } }) => theme);

  return (
    <ThemeProvider theme={selectedTheme === 'light' ? lightTheme : darkTheme}>
      <Stack sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <React.StrictMode>
          <Hub />
        </React.StrictMode>
      </Stack>
    </ThemeProvider>
  );
}
ReactDOM.render(
  <Provider store={store}>
    <ThemePicker />
  </Provider>,
  document.getElementById('root'),
);
