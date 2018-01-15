import React from 'react';
import { render } from 'react-dom';
import { useStrict } from 'mobx';
import { TweenLite } from 'gsap';

import Root from './components/Root';
import './injectGlobal';

useStrict(true);

render(
  <Root ticker={TweenLite.ticker} />,
  document.getElementById('root'),
);

