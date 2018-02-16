import React from 'react';
import { render } from 'react-dom';
import { useStrict } from 'mobx';

import Root from './components/Root';
import './injectGlobal';

if (process.env.NODE_ENV === 'production') {
  Raven.config('https://e772f6a8ded84c8f8f74176a32a410bf@sentry.io/288907', {
    release: process.env.RELEASE_ID,
  }).install();
}

console.log(process.env.RELEASE_ID.substring(0, 7));

useStrict(true);

render(<Root />, document.getElementById('root'));
