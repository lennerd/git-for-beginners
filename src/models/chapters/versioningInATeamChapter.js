import React, { Fragment } from 'react';
import { action } from 'mobx';
import { action as popmotionAction } from 'popmotion';

import { createChapter, init } from '../Chapter';
import { ChapterText } from '../ChapterSection';
import Visualisation from '../vis/Visualisation';
import VisualisationArea from '../vis/VisualisationArea';
import { STATUS_ADDED } from '../../constants';
import SimpleFileVisualisation from '../vis/SimpleFileVisualisation';
import { loop, delay } from './utils';

const versioningInATeam = createChapter('Versioning in a Team', {
  sections: [
    new ChapterText(() => 'Let’s replace the cloud with a version database.', {
      skip: true,
    }),
    new ChapterText(() => (
      <Fragment>
        Again User A is creating a new file, adds some changes and uploads the
        file to the version database. <em>A first version is created.</em>
      </Fragment>
    )),
    new ChapterText(() => (
      <Fragment>
        User B jumps in, downloads the content, makes some modification and
        uploads the file again. <em>A second version is created.</em>
      </Fragment>
    )),
    new ChapterText(() => 'Again this can go on, and on, and on …'),
    new ChapterText(() => (
      <strong>
        Welcome to “Git for Beginners” – an interactive tutorial to learn and
        understand Git, a popular version control system to help you and your
        team to not loose data again.
      </strong>
    )),
    new ChapterText(() => 'But let’s start by taking a look at …'),
  ],
  [init]() {
    this.vis = new Visualisation();

    this.visUserA = new VisualisationArea('User A');
    this.visVersionDatabase = new VisualisationArea('Version Database');
    this.visVersionDatabase.column = 1;
    this.visUserB = new VisualisationArea('User B');
    this.visUserB.column = 2;

    this.vis.add(this.visUserA);
    this.vis.add(this.visVersionDatabase);
    this.vis.add(this.visUserB);

    this.visFile = new SimpleFileVisualisation();
    this.visFile.status = STATUS_ADDED;
    this.visUserFileA = new SimpleFileVisualisation();
    this.visUserFileA.visible = true;
    this.visUserFileB = new SimpleFileVisualisation();
    this.visUserFileB.visible = true;

    this.visUserA.add(this.visUserFileA);
    this.visUserB.add(this.visUserFileB);

    this.currentUser = this.visUserA;
    this.otherUser = this.visUserB;

    this.switchUser = popmotionAction(
      action(({ complete }) => {
        const otherUser = this.otherUser;
        this.otherUser = this.currentUser;
        this.currentUser = otherUser;
        this.currentUser.row = 0;
        complete();
      }),
    );

    this.downloadToUserA = popmotionAction(
      action(({ complete }) => {
        this.visUserA.add(this.visFile);
        complete();
      }),
    );

    this.downloadToUserB = popmotionAction(
      action(({ complete }) => {
        this.visUserB.add(this.visFile);
        complete();
      }),
    );

    this.modify = popmotionAction(({ complete }) => {
      this.visFile.modify();
      complete();
    });

    this.uploadToVersionDatabase = popmotionAction(({ complete }) => {
      this.visVersionDatabase.add(this.visFile);
      complete();
    });

    this.toggleCurrentFile = popmotionAction(({ complete }) => {
      this.currentUser.find(object => object.isFile).toggle();
      complete();
    });

    this.versions = [];
    this.versionsCounter = 0;

    this.createVersion = popmotionAction(({ complete }) => {
      const version = this.visFile.copy();
      this.versions
        .splice(6)
        .forEach(version => this.visVersionDatabase.remove(version));
      this.versions.unshift(version);
      version.name = `Version ${++this.versionsCounter}`;
      this.visVersionDatabase.add(version);
      complete();
    });

    this.shiftVersions = popmotionAction(
      action(({ complete }) => {
        this.visVersionDatabase.traverse(
          object => object.isFile && object.row++,
        );
        this.visVersionDatabase.height = this.versions.length + 1;
        this.otherUser.row++;
        complete();
      }),
    );

    this.visUserA.add(this.visFile);

    loop(
      this.toggleCurrentFile,
      delay(1000),
      this.modify,
      delay(1000),
      this.toggleCurrentFile,
      this.uploadToVersionDatabase,
      delay(1000),
      this.createVersion,
      this.switchUser,
      delay(1000),
      this.downloadToUserB,
      delay(1000),
      this.shiftVersions,
      this.toggleCurrentFile,
      delay(1000),
      this.modify,
      delay(1000),
      this.toggleCurrentFile,
      this.uploadToVersionDatabase,
      delay(1000),
      this.createVersion,
      this.switchUser,
      delay(1000),
      this.downloadToUserA,
      delay(1000),
      this.shiftVersions,
    ).start();
  },
});

export default versioningInATeam;
