import React from 'react';
import { ThemeProvider } from '@emotion/react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
import Hub from './Pages/Hub/Hub';
import { store } from './Redux/store';
import theme from './Theme';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <React.StrictMode>
        <Hub />
      </React.StrictMode>
    </Provider>
  </ThemeProvider>,
  document.getElementById('root'),
);
