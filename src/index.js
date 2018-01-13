import React from 'react';
import { render } from 'react-dom';
import { useStrict } from 'mobx';
import { TweenLite } from 'gsap';

import Root from './components/Root';
import tutorial from './tutorial';
import theme from './theme';
import './injectGlobal';

useStrict(true);

render(
  <Root tutorial={tutorial} ticker={TweenLite.ticker} theme={theme} />,
  document.getElementById('root'),
);

