import { SECTION_TASK, ACTION_ADD_FILE } from "../../constants";

export default {
  title: 'Versioning of Files',
  sections: [
    {
      type: SECTION_TASK,
      text: 'Create a file.',
      action: ACTION_ADD_FILE,
    }
  ],
};
