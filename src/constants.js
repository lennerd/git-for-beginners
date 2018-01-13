/*export const SECTION_TEXT = 'section.text';
export const SECTION_TASK = 'section.task';

function createAction(type, payloadCreator = (payload) => payload) {
  const typeString = type.toString();

  const actionCreator = (...args) => {
    const action = { type };
    const payload = payloadCreator(...args);

    if (payload !== undefined) {
      action.payload = payload;
    }

    return action;
  };

  actionCreator.toString = () => typeString;

  return actionCreator;
}

export const ACTION_READ_ON = createAction('action.read_on');
export const ACTION_ADD_FILE = createAction('action.add_file');
export const ACTION_DELETE_FILE = createAction('action.delete_file');
export const ACTION_COPY_FILE = createAction('action.copy_file');
export const ACTION_MODIFY_FILE = createAction('action.modify_file');
export const ACTION_RESTORE_FILE = createAction('action.restore_file');*/

export const CHAPTER_INTRODUCTION = 'Introduction';
export const CHAPTER_VERSIONING_OF_FILES = 'Versioning of Files';
