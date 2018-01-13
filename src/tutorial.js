/*import { autorun } from 'mobx';
import { update, serialize } from 'serializr';

import chapters from './data/chapters';
import Tutorial from "./models/Tutorial";

const tutorial = Tutorial.create({ chapters });

const state = localStorage.getItem('tutorial');

// Restore old state from local storage
if (state != null) {
  update(Tutorial, tutorial, JSON.parse(state));
}

// Store new states into local storge, as soon as serializable properties changed.
autorun(() => {
  const state = JSON.stringify(serialize(tutorial));

  localStorage.setItem('tutorial', state);
});*/

import Tutorial from "./models/Tutorial";
import Chapter from "./models/Chapter";
import {
  CHAPTER_INTRODUCTION,
  CHAPTER_VERSIONING_OF_FILES
} from "./constants";

const tutorial = new Tutorial([
  new Chapter(CHAPTER_INTRODUCTION, { visibleSections: 1 }),
  new Chapter(CHAPTER_VERSIONING_OF_FILES),
]);

export default tutorial;
