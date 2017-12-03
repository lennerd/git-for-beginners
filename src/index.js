import React from 'react';
import { render } from 'react-dom';
import { TweenLite, Power2 } from 'gsap';
import { Provider } from 'mobx-react';

import App from './components/App';
import './injectGlobal';

TweenLite.defaultEase = Power2.easeInOut;

render((
  <Provider ticker={TweenLite.ticker}>
    <App />
  </Provider>
), document.getElementById('root'));
