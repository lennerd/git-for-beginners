import { transaction, autorun } from 'mobx';
import { update, serialize } from 'serializr';

import TutorialState from "./models/TutorialState";
import Tutorial from './models/Tutorial';
import introductionChapter from './models/introductionChapter';
import versioningOfFilesChapter from './models/versioningOfFilesChapter';
import gitChapter from './models/gitChapter';

const STORAGE_KEY = 'tutorialState';

const tutorialState = new TutorialState();

const serializedTutorialState = JSON.parse(localStorage.getItem(STORAGE_KEY));

transaction(() => {
  if (serializedTutorialState != null) {
    update(TutorialState, tutorialState, serializedTutorialState);
  }
});

autorun(() => {
  const deserializedTutorialState = serialize(tutorialState);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(deserializedTutorialState));

  console.log('---');
  console.log(deserializedTutorialState);
});

const tutorial = new Tutorial(tutorialState);

tutorial.register([
  introductionChapter,
  versioningOfFilesChapter,
  gitChapter,
]);

export default tutorial;
