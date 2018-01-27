import React from 'react';
import { render } from 'react-dom';
import { useStrict } from 'mobx';

import Root from './components/Root';
import './injectGlobal';

useStrict(true);

render(<Root />, document.getElementById('root'));
