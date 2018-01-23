import React, { Fragment } from "react";

import { createChapter, init } from "../Chapter";
import { ChapterText } from "../ChapterSection";
import Visualisation from "../vis/Visualisation";
import VisualisationArea from "../vis/VisualisationArea";

const versioningInATeam = createChapter('Versioning in a Team', {
  sections: [
    new ChapterText(() => (
      'Let’s replace the cloud with a version database. Again User A is creating a new file, adds some changes and uploads the file to the version database. A first version is created.'
    )),
    new ChapterText(() => (
      <Fragment>
        User B jumps in, downloads the content, makes some modification and uploads the file again. A second version is created.
      </Fragment>
    )),
    new ChapterText(() => (
      'Again this can go on, and on, and on …'
    )),
    new ChapterText(() => (
      <strong>Welcome to “Git for Beginners” – an interactive tutorial to learn and understand Git, a popular version control system to help you and your team to not loose data again.</strong>
    )),
    new ChapterText(() => 'But let’s start by taking a look at …'),
  ],
  [init]() {
    this.vis = new Visualisation();

    this.visUserA = new VisualisationArea('User A');
    this.visCloud = new VisualisationArea('Version Database');
    this.visCloud.column = 1;
    this.visUserB = new VisualisationArea('User B');
    this.visUserB.column = 2;

    this.vis.add(this.visUserA);
    this.vis.add(this.visVersionDatabase);
    this.vis.add(this.visUserB);
  },
});

export default versioningInATeam;
