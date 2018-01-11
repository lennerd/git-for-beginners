import { SECTION_TASK } from './sectionTypes';

export default {
  title: 'Versioning of Files',
  sections: [
    {
      type: SECTION_TASK,
      text: 'Create a file.',
      done: (state) => {
        return false;
      }
    }
  ],
};
