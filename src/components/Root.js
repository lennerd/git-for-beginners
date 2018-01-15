import React from 'react';
import { Provider } from 'mobx-react';
import { ThemeProvider } from 'styled-components';
//import { hot } from 'react-hot-loader';

import tutorial from '../tutorial';
import theme from '../theme';
import glossary from '../glossary';

import App from './App';

function Root({ ticker }) {
  return (
    <Provider tutorial={tutorial} ticker={ticker} glossary={glossary}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  );
}

export default /*hot(module)*/(Root);
