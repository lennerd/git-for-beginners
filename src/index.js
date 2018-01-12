import React from 'react';
import { render } from 'react-dom';
import { useStrict } from 'mobx';

import Root from './components/Root';
import tutorial from './tutorial';
import theme from './theme';
import './injectGlobal';

useStrict(true);

render(
  <Root tutorial={tutorial} theme={theme} />,
  document.getElementById('root'),
);

