import React from 'react';
import { render } from 'react-dom';
import { TweenLite, Power2 } from 'gsap';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import { BrowserRouter } from 'react-router-dom'

import App from './components/App';
import stores from './stores';
import './injectGlobal';

TweenLite.defaultEase = Power2.easeInOut;
useStrict(true);

render((
  <Provider
    ticker={TweenLite.ticker}
    {...stores}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
), document.getElementById('root'));
