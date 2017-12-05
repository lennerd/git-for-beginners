import React from 'react';
import { render } from 'react-dom';
import { TweenLite, Power2 } from 'gsap';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';

import App from './components/App';
import scene from './scene';
import './injectGlobal';

TweenLite.defaultEase = Power2.easeInOut;
useStrict(true);

render((
  <Provider
    scene={scene}
    ticker={TweenLite.ticker}
  >
    <App />
  </Provider>
), document.getElementById('root'));
