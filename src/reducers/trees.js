import { createAction, handleActions } from 'redux-actions';
import uuid from 'uuid/v4';
import sha1 from 'js-sha1';

const DEFAULT_STATE = [];

export const addTree = createAction('TREES/ADD_TREE');

export default handleActions({
  [addTree](state, tree) {
    return [
      ...state,
      tree,
    ];
  }
}, DEFAULT_STATE);

export function createFile(name) {
  return {
    id: uuid(),
    name,
  };
}

export function createCommit(author, message, files) {
  const commit = {
    author,
    message,
    files,
  };

  commit.id = sha1(JSON.stringify(commit));

  return commit;
}

export function createArea(name) {
  return {
    name,
  };
}

export function createTree() {
  return {
    files: [],
    commits: [],
    areas: [],
  }
}
