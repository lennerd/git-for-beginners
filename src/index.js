import React from 'react';
import { render } from 'react-dom';
import { TweenLite, Power2 } from 'gsap';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components';

import App from './components/App';
import stores from './stores';
import theme from './theme';
import './injectGlobal';

TweenLite.defaultEase = Power2.easeInOut;
useStrict(true);

render((
  <Provider
    ticker={TweenLite.ticker}
    {...stores}
  >
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </Provider>
), document.getElementById('root'));
