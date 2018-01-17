import { transaction, autorun } from 'mobx';
import { update, serialize } from 'serializr';

import TutorialState from "./models/TutorialState";
import Tutorial from './models/Tutorial';
import introductionChapter from './models/introductionChapter';
import versioningOfFilesChapter from './models/versioningOfFilesChapter';
import gitChapter from './models/gitChapter';
import versioningInGitChapter from './models/versioningInGitChapter';
import commandlineChapter from './models/commandlineChapter';
import gitInTheConsoleChapter from './models/gitInTheConsoleChapter';
import workingInATeamChapter from './models/workingInATeamChapter';
import gitBranchesChapter from './models/gitBranchesChapter';
import versioningInATeamChapter from './models/versioningInATeamChapter';
import gitInATeamChapter from './models/gitInATeamChapter';

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

  if (process.env.NODE_ENV === 'development') {
    console.log('---');
    console.log(deserializedTutorialState);
  }
});

const tutorial = new Tutorial(tutorialState);

tutorial.init([
  introductionChapter,
  versioningOfFilesChapter,
  gitChapter,
  versioningInGitChapter,
  commandlineChapter,
  gitInTheConsoleChapter,
  workingInATeamChapter,
  versioningInATeamChapter,
  gitInATeamChapter,
  gitBranchesChapter,
]);

export default tutorial;
