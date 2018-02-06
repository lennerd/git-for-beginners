import { transaction, autorun } from 'mobx';
import { update, serialize } from 'serializr';
import uuid from 'uuid/v4';
import sha1 from 'js-sha1';
import createHistory from 'history/createBrowserHistory';

import TutorialState from './models/TutorialState';
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
import sandboxChapter from './models/chapters/sandboxChapter';

const history = createHistory({
  basename: process.env.PUBLIC_URL,
});
let sessionId = history.location.search.substr(1);

if (sessionId === '') {
  sessionId = sha1(uuid()).substr(0, 7);
  history.push(`/?${sessionId}`);
}

const tutorialState = new TutorialState();

const serializedTutorialState = JSON.parse(localStorage.getItem(sessionId));

transaction(() => {
  if (serializedTutorialState != null) {
    update(TutorialState, tutorialState, serializedTutorialState);
  }
});

autorun(() => {
  const deserializedTutorialState = serialize(tutorialState);

  localStorage.setItem(sessionId, JSON.stringify(deserializedTutorialState));
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
  sandboxChapter,
]);

export default tutorial;
