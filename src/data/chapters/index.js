import introduction from "./introduction";
import versioningOfFiles from "./versioningOfFiles";

let nextChapterId = 1;
let nextSectionId = 1;

const chapters = [
  introduction,
  versioningOfFiles,
].map(chapter => ({
  ...chapter,
  id: nextChapterId++,
  sections: chapter.sections.map(section => ({
    ...section,
    id: nextSectionId++,
  }))
}));

export default chapters;
