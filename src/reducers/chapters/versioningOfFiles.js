import { SECTION_TASK } from './sectionTypes';
import { selectCurrentTree } from '../../selectors/trees';

export default {
  title: 'Versioning of Files',
  sections: [
    {
      type: SECTION_TASK,
      content: 'Create a file.',
      done: (state) => {
        const currentTree = selectCurrentTree(state);

        return currentTree.files.length > 0;
      }
    }
  ],
};
