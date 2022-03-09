import React from 'react';
import { ThemeProvider } from '@emotion/react';
import ReactDOM from 'react-dom';
import './index.css';
import { Stack } from '@mui/material';
import { Provider } from 'react-redux';
import Hub from './Pages/Hub/Hub';
import { store } from './Redux/store';
import theme, { darkTheme } from './Theme';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Stack sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Provider store={store}>
        <React.StrictMode>
          <Hub />
        </React.StrictMode>
      </Provider>
    </Stack>
  </ThemeProvider>,
  document.getElementById('root'),
);
