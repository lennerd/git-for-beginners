import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import { ThemeProvider } from 'styled-components';

import tutorial from '../tutorial';
import theme from '../theme';
import glossary from '../glossary';

import App from './App';

class Root extends Component {
  componentDidCatch(error, errorInfo) {
    if (process.env.NODE_ENV === 'production') {
      Raven.captureException(error, { extra: errorInfo });
      Raven.showReportDialog();
    }
  }

  render() {
    return (
      <Provider tutorial={tutorial} glossary={glossary}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </Provider>
    );
  }
}

export default /*hot(module)*/ Root;
