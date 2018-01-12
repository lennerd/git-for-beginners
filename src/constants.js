export const SECTION_TEXT = 'section.text';
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
