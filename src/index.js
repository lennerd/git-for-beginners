import React from 'react';
import { render } from 'react-dom';

import Root from './components/Root';
import tutorial from './data/tutorial';
import theme from './theme';
import './injectGlobal';

render(
  <Root tutorial={tutorial} theme={theme} />,
  document.getElementById('root'),
);

