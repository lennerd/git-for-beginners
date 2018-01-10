import { createAction, handleActions } from 'redux-actions';

const DEFAULT_STATE = {
  chapterIndex: 0,
  sectionIndex: 0,
};

export const readOn = createAction('PROGRESS/READ_ON');

export default handleActions({
  [readOn](state) {
    return {
      ...state,
      sectionIndex: state.sectionIndex + 1,
    }
  }
}, DEFAULT_STATE);
