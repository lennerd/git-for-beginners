import { transaction, autorun } from 'mobx';
import { update, serialize } from 'serializr';

import TutorialState from "./models/TutorialState";
import ChapterState from "./models/ChapterState";
import {
  CHAPTER_INTRODUCTION,
  CHAPTER_VERSIONING_OF_FILES,
  CHAPTER_VERSIONING_IN_GIT,
  CHAPTER_GIT
} from "./constants";

const tutorial = new TutorialState([
  new ChapterState(CHAPTER_INTRODUCTION),
  new ChapterState(CHAPTER_VERSIONING_OF_FILES),
  new ChapterState(CHAPTER_GIT),
  new ChapterState(CHAPTER_VERSIONING_IN_GIT),
]);

const state = localStorage.getItem('tutorial');

transaction(() => {
  if (state != null) {
    update(TutorialState, tutorial, JSON.parse(state));
  }
});

autorun(() => {
  const state = JSON.stringify(serialize(tutorial));

  localStorage.setItem('tutorial', state);

  console.log('---');
  console.log(state);
});

export default tutorial;
