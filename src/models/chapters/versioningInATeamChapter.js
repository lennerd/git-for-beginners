import React, { Fragment } from 'react';
import { action } from 'mobx';
import { action as popmotionAction, chain } from 'popmotion';

import { createChapter, init, readOn } from '../Chapter';
import { ChapterText } from '../ChapterSection';
import Visualisation from '../vis/Visualisation';
import VisualisationArea from '../vis/VisualisationArea';
import { STATUS_ADDED } from '../../constants';
import SimpleFileVisualisation from '../vis/SimpleFileVisualisation';
import { loop, delay, actionQueue } from './utils';
import Tooltip from '../../components/Tooltip';

const versioningInATeam = createChapter('Versioning in a Team', {
  sections: [
    new ChapterText(
      () => (
        <Fragment>
          Let’s replace the cloud with a{' '}
          <Tooltip name="versionDatabase">version database</Tooltip>.
        </Fragment>
      ),
      {
        skip: true,
      },
    ),
    new ChapterText(() => (
      <Fragment>
        Again User A is creating a new file, adding some changes and uploading
        the file to the version database. <em>The first version is created.</em>
      </Fragment>
    )),
    new ChapterText(() => (
      <Fragment>
        User B jumps in, downloads the content, makes some modification and
        uploads the file again. <em>The second version is created.</em>
      </Fragment>
    )),
    new ChapterText(() => <em>This can go on, again, and again …</em>),
    new ChapterText(() => (
      <Fragment>
        Isn’t that nice. Now new changes are stored in a new version of the
        file. But one problem is still existing. Both users can’t change content
        at the same time but need to wait for each other to upload the changes.
      </Fragment>
    )),
    new ChapterText(() => (
      <Fragment>
        That’s why version databases are able to merge changes from different
        users into a single version.{' '}
        <em>
          Let’s see how both users will be able to make changes at the same
          time.
        </em>
      </Fragment>
    )),
    new ChapterText(() => (
      <Fragment>
        Since the basics are done now, it’s time to jump back to Git and look
        how Git supports teamwork.
      </Fragment>
    )),
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
    this.visUserFileA.visible = false;
    this.visUserFileB = new SimpleFileVisualisation();
    this.visUserFileB.visible = false;

    this.visUserA.add(this.visUserFileA);
    this.visUserB.add(this.visUserFileB);

    this.currentUser = this.visUserA;
    this.otherUser = this.visUserB;

    this.visSecondFile = new SimpleFileVisualisation();

    this.switchUser = popmotionAction(
      action(({ complete }) => {
        if (!this.loopNonlinear) {
          const otherUser = this.otherUser;
          this.otherUser = this.currentUser;
          this.currentUser = otherUser;
          this.currentUser.row = 0;
        }

        complete();
      }),
    );

    this.downloadToCurrentUser = popmotionAction(
      action(({ complete }) => {
        if (!this.loopNonlinear) {
          this.visFile.reset();
          this.currentUser.add(this.visFile);
        } else {
          this.visFile.reset();
          this.visSecondFile.reset();
          this.currentUser.add(this.visFile);
          this.otherUser.add(this.visSecondFile);
        }
        complete();
      }),
    );

    this.modify = popmotionAction(({ complete }) => {
      this.visFile.modify();

      if (this.loopNonlinear) {
        this.visSecondFile.modify();
      }
      complete();
    });

    this.uploadToVersionDatabase = popmotionAction(({ complete }) => {
      this.visVersionDatabase.add(this.visFile);

      if (this.loopNonlinear) {
        this.visVersionDatabase.add(this.visSecondFile);
      }
      complete();
    });

    this.toggleCurrentFile = popmotionAction(({ complete }) => {
      this.currentUser.find(object => object.isFile).toggle();

      if (this.loopNonlinear) {
        this.otherUser.find(object => object.isFile).toggle();
      }

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

      if (this.loopNonlinear) {
        version.diff = {
          added: this.visFile.diff.added + this.visSecondFile.diff.added,
          removed: this.visFile.diff.removed + this.visSecondFile.diff.removed,
        };
      }

      this.visFile.reset();
      this.visSecondFile.reset();
      this.visVersionDatabase.add(version);
      complete();
    });

    this.shiftVersions = popmotionAction(
      action(({ complete }) => {
        this.visVersionDatabase.traverse(
          object => object.isFile && object.row++,
        );
        this.visVersionDatabase.height = this.versions.length + 1;

        if (!this.loopNonlinear) {
          this.otherUser.row++;
        }
        complete();
      }),
    );

    this.visUserA.add(this.visFile);
    this.actionQueue = actionQueue().start();
  },
  [readOn]() {
    if (!this.firstVersion) {
      this.firstVersion = true;

      this.actionQueue.add(
        delay(400),
        this.modify,
        delay(1000),
        this.toggleCurrentFile,
        this.uploadToVersionDatabase,
        delay(1000),
        this.createVersion,
      );
    } else if (!this.secondVersion) {
      this.secondVersion = true;

      this.actionQueue.add(
        this.switchUser,
        delay(1000),
        this.downloadToCurrentUser,
        delay(1000),
        this.shiftVersions,
        delay(1000),
        this.modify,
        delay(1000),
        this.toggleCurrentFile,
        this.uploadToVersionDatabase,
        delay(1000),
        this.createVersion,
      );
    } else if (!this.loopLinear) {
      this.loopLinear = true;
      this.loop = loop(
        this.switchUser,
        delay(1000),
        this.downloadToCurrentUser,
        delay(1000),
        this.shiftVersions,
        delay(1000),
        this.toggleCurrentFile,
        this.modify,
        delay(1000),
        this.toggleCurrentFile,
        this.uploadToVersionDatabase,
        delay(1000),
        this.createVersion,
      );

      this.actionQueue.add(this.loop);
    } else if (!this.loopNonlinear) {
      this.loopNonlinear = true;

      this.visUserFileA.visible = true;
      this.visUserFileB.visible = true;
      this.visUserA.row = 0;
      this.visUserB.row = 0;

      this.visFile.reset();
      this.visSecondFile.reset();
    }
  },
});

export default versioningInATeam;
