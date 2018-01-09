import { combineReducers } from 'redux';

import progress from './progress';
import chapters from './chapters';
import trees from './trees';

export default combineReducers({
  progress,
  chapters,
  trees,
});
