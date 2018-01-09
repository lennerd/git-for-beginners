import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import tutorial from './reducers';

let enhancer = applyMiddleware(
  thunkMiddleware
);

if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
  enhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(enhancer);
}

export default createStore(
  tutorial,
  enhancer,
);
