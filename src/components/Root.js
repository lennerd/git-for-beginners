import React from 'react';
import { Provider } from 'mobx-react';
import { ThemeProvider } from 'styled-components';
//import { hot } from 'react-hot-loader'

import App from './App';

function Root({ tutorial, theme }) {
  return (
    <Provider tutorial={tutorial}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  );
}

export default /*hot(module)*/(Root);
