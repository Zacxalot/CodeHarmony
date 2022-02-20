import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
import Hub from './Pages/Hub/Hub';
import { store } from './Redux/store';

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <Hub />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root'),
);
