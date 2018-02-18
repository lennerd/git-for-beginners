import React, { Fragment } from 'react';
import { action as popmotionAction } from 'popmotion';

import { createChapter, readOn, init } from '../Chapter';
import { ChapterText } from '../ChapterSection';
import Tooltip from '../../components/Tooltip';
import Visualisation from '../vis/Visualisation';
import VisualisationArea from '../vis/VisualisationArea';
import { actionQueue, loop, delay } from './utils';
import SimpleFileVisualisation from '../vis/SimpleFileVisualisation';
import { STATUS_ADDED } from '../../constants';

const workingInATeamChapter = createChapter('Working in a Team', {
  sections: [
    new ChapterText(() => (
      <Fragment>
        Working on a project usally means working in a team. This means we need
        to exchange our files, for example by using a{' '}
        <Tooltip name="cloud">cloud</Tooltip>. Let’s take a closer look at a
        project e.g. with one file and two users.
      </Fragment>
    )),
    new ChapterText(() => (
      <Fragment>
        User A starts editing a file on their computer. They add a few changes
        to it and then upload the file to the cloud.
      </Fragment>
    )),
    new ChapterText(() => (
      <Fragment>
        Once the file beeing uploaded a second user B wants to work on the file,
        too. They download the file, add some changes and upload the file again.
      </Fragment>
    )),
    new ChapterText(() => <em>This goes on and on and on …</em>),
    new ChapterText(() => (
      <Fragment>
        Very easy to do. But there is one big problem. Both users need to wait
        until one or the other has finished editing the file. Otherwise changes
        will be lost easily. Versioning to the rescue …
      </Fragment>
    )),
  ],
  [init]() {
    this.vis = new Visualisation();

    this.visUserA = new VisualisationArea('User A');
    this.visCloud = new VisualisationArea('Cloud');
    this.visCloud.column = 1;
    this.visUserB = new VisualisationArea('User B');
    this.visUserB.column = 2;

    this.visFile = new SimpleFileVisualisation();
    this.visFile.status = STATUS_ADDED;
    this.visUserFileA = new SimpleFileVisualisation();
    this.visCloudFile = new SimpleFileVisualisation();
    this.visUserFileB = new SimpleFileVisualisation();

    this.downloadToUserA = popmotionAction(({ complete }) => {
      this.visUserA.add(this.visFile);
      complete();
    });

    this.downloadToUserB = popmotionAction(({ complete }) => {
      this.visUserB.add(this.visFile);
      complete();
    });

    this.modify = popmotionAction(({ complete }) => {
      this.visFile.modify();
      complete();
    });

    this.uploadData = popmotionAction(({ complete }) => {
      this.visCloud.add(this.visFile);
      complete();
    });

    this.storeCloudFile = popmotionAction(({ complete }) => {
      this.visCloud.add(this.visCloudFile);
      complete();
    });

    this.storeUserBFile = popmotionAction(({ complete }) => {
      this.visUserB.add(this.visUserFileB);
      complete();
    });

    this.toggleUserFileA = popmotionAction(({ complete }) => {
      this.visUserFileA.toggle();
      complete();
    });

    this.toggleUserFileB = popmotionAction(({ complete }) => {
      this.visUserFileB.toggle();
      complete();
    });

    this.toggleCloudFile = popmotionAction(({ complete }) => {
      this.visCloudFile.toggle();
      complete();
    });

    this.actionQueue = actionQueue().start();
  },
  [readOn]() {
    if (!this.userA) {
      this.vis.add(this.visUserA);
      this.vis.add(this.visCloud);
      this.vis.add(this.visUserB);

      this.visUserA.add(this.visFile);
      this.visUserA.add(this.visUserFileA);
      this.visUserA.add(this.visCloudFile);

      this.userA = true;
    } else if (!this.firstUpload) {
      this.firstUpload = true;

      this.actionQueue.add(
        delay(400),
        this.toggleUserFileA,
        this.toggleCloudFile,
        this.modify,
        delay(1000),
        this.toggleUserFileA,
        this.toggleCloudFile,
        this.uploadData,
        this.storeCloudFile,
        delay(2000),
      );
    } else if (!this.userB) {
      this.userB = true;

      this.actionQueue.add(
        this.downloadToUserB,
        delay(1000),
        this.modify,
        delay(1000),
        this.storeUserBFile,
        this.uploadData,
        delay(2000),
      );
    } else if (!this.loop) {
      this.loop = true;

      this.actionQueue.add(
        loop(
          this.downloadToUserA,
          delay(1000),
          this.toggleUserFileA,
          this.modify,
          delay(1000),
          this.toggleUserFileA,
          this.uploadData,
          delay(2000),
          this.downloadToUserB,
          delay(1000),
          this.toggleUserFileB,
          this.modify,
          delay(1000),
          this.toggleUserFileB,
          this.uploadData,
          delay(2000),
        ),
      );
    }
  },
});

export default workingInATeamChapter;
