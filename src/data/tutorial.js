import chapters from './chapters';
import Tutorial from '../models/Tutorial';

const currentChapter = chapters[0];
currentChapter.sections[0].reach();

const tutorial = new Tutorial({
  chapters,
  currentChapter,
});

export default tutorial;

if (module.hot) {
  module.hot.accept('./chapters', () => {
    tutorial.reload({ chapters });
  });
}
