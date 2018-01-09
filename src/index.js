import React from 'react';
import { render } from 'react-dom';

import Root from './components/Root';
import store from './store';
import theme from './theme';
import './injectGlobal';

render(
  <Root store={store} theme={theme} />,
  document.getElementById('root'),
);

