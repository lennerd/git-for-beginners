import introduction from "./introduction";
import versioningOfFiles from "./versioningOfFiles";
import Chapter from "../../models/Chapter";
import Section from "../../models/Section";

let nextChapterId = 1;
let nextSectionId = 1;

const chapters = [
  introduction,
  versioningOfFiles,
  introduction,
  versioningOfFiles,
].map(chapter => new Chapter({
  ...chapter,
  id: nextChapterId++,
  sections: chapter.sections.map(section => new Section({
    ...section,
    id: nextSectionId++,
  }))
}));

export default chapters;
