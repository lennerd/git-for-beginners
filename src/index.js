import store from './store';
import { selectTutorialProgress } from './selectors/progress';

console.log(selectTutorialProgress(store.getState()));

