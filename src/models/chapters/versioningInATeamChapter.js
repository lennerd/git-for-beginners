import React, { Fragment } from "react";
import { observable, action, computed } from "mobx";
import { action as popmotionAction, delay, chain } from "popmotion";

import { createChapter, init } from "../Chapter";
import { ChapterText } from "../ChapterSection";
import Visualisation from "../vis/Visualisation";
import VisualisationArea from "../vis/VisualisationArea";
import VisualisationFile from "../vis/VisualisationFile";
import { STATUS_UNMODIFIED, STATUS_MODIFIED } from "../../constants";
import chance from "../chance";
import { loop } from "./utils";

class FileVisualisation extends VisualisationFile {
  @observable diff = { added: 0, removed: 0 };
  @observable status = STATUS_UNMODIFIED;

  @action
  modify() {
    this.diff = chance.diff(this.diff);
    this.status = STATUS_MODIFIED;
  }

  @computed
  get maxChanges() {
    return this.diff.added + this.diff.removed;
  }
}

const versioningInATeam = createChapter("Versioning in a Team", {
  sections: [
    new ChapterText(() => "Let’s replace the cloud with a version database.", {
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
    new ChapterText(() => "Again this can go on, and on, and on …"),
    new ChapterText(() => (
      <strong>
        Welcome to “Git for Beginners” – an interactive tutorial to learn and
        understand Git, a popular version control system to help you and your
        team to not loose data again.
      </strong>
    )),
    new ChapterText(() => "But let’s start by taking a look at …"),
  ],
  [init]() {
    this.vis = new Visualisation();

    this.visUserA = new VisualisationArea("User A");
    this.visVersionDatabase = new VisualisationArea("Version Database");
    this.visVersionDatabase.column = 1;
    this.visUserB = new VisualisationArea("User B");
    this.visUserB.column = 2;

    this.vis.add(this.visUserA);
    this.vis.add(this.visVersionDatabase);
    this.vis.add(this.visUserB);

    this.visFile = new FileVisualisation();

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

    /*this.currentUser = this.visUserA;
    this.otherUser = this.visUserB;

    this.createSlot = popmotionAction(({ complete }) => {
      this.otherUser.row++;
      this.versionDatabase.height++;
      this.versionDatabase.traverse(object => object.isFile && object.row++);
      complete();
    });*/

    this.backup = popmotionAction(({ complete }) => {
      this.visVersionDatabase.add(this.visFile);
      complete();
    });

    this.createVersion = popmotionAction(({ complete }) => {
      this.visVersionDatabase.add(new FileVisualisation());
      complete();
    });

    this.currentUser = this.visUserA;
    this.otherUser = this.visUserB;

    this.switchVersion = popmotionAction(({ complete }) => {
      const otherUser = this.currentUser;

      this.otherUser = this.currentUser;
      this.currentUser = otherUser;
    });

    /*chain(
      delay(1400),
      this.downloadToUserA,
      delay(1400),
      this.modify,
      delay(1400),
      this.backup,
      delay(1400),
      this.createVersion,
      delay(1400),
      this.switchUser,
      delay(1400),
      this.downloadToUserB,
      delay(1400),
      this.backup,
    ).start();*/

    /*loop(
      delay(1000),
      this.downloadToUserA,
      delay(2000),
      this.modify,
      delay(2000),
      this.backup,
      delay(2000),
      this.downloadToUserB,
      delay(2000),
      this.modify,
      delay(2000),
      this.backup,
      delay(1000),
    ).start();*/
  },
});

export default versioningInATeam;
