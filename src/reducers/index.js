import { combineReducers } from 'redux';

import progress from './progress';
import chapters from './chapters';

export default combineReducers({
  progress,
  chapters,
});
