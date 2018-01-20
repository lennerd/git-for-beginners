import { transaction, autorun } from 'mobx';
import { update, serialize } from 'serializr';

import TutorialState from "./models/TutorialState";
import Tutorial from './models/Tutorial';
import introductionChapter from './models/chapters/introductionChapter';
import versioningOfFilesChapter from './models/chapters/versioningOfFilesChapter';
import gitChapter from './models/chapters/gitChapter';
import versioningInGitChapter from './models/chapters/versioningInGitChapter';
import commandlineChapter from './models/chapters/commandlineChapter';
import gitInTheConsoleChapter from './models/chapters/gitInTheConsoleChapter';
import workingInATeamChapter from './models/chapters/workingInATeamChapter';
import gitBranchesChapter from './models/chapters/gitBranchesChapter';
import versioningInATeamChapter from './models/chapters/versioningInATeamChapter';
import gitInATeamChapter from './models/chapters/gitInATeamChapter';

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
