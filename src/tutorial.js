import { autorun } from 'mobx';
import { update, serialize } from 'serializr';

import Tutorial from "./models/Tutorial";
import Chapter from "./models/Chapter";
import {
  CHAPTER_INTRODUCTION,
  CHAPTER_VERSIONING_OF_FILES
} from "./constants";

const tutorial = new Tutorial([
  new Chapter(CHAPTER_INTRODUCTION),
  new Chapter(CHAPTER_VERSIONING_OF_FILES),
]);

const state = localStorage.getItem('tutorial');

if (state != null) {
  update(Tutorial, tutorial, JSON.parse(state));
}

autorun(() => {
  const state = JSON.stringify(serialize(tutorial));

  localStorage.setItem('tutorial', state);
  console.log('Stored new state.');
});

console.log(serialize(tutorial));

export default tutorial;
