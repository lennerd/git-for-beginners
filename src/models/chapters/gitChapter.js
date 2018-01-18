import React, { Fragment } from "react";

import { createChapter, readOn, init } from "../Chapter";
import { ChapterText } from "../ChapterSection";
import Tooltip from "../../components/Tooltip";
import Visualisation from "../Visualisation";
import VisualisationArea from "../VisualisationArea";
import VisualisationFile from "../VisualisationFile";
import { STATUS_MODIFIED } from "../../constants";
import VisualisationFileList from "../VisualisationFileList";
import VisualisationCommit from "../VisualisationCommit";
import VisualisationRepository from "../VisualisationRepository";

const introductionChapter = createChapter('Git', {
  hasWorkingDirectory: false,
  hasStagingArea: false,
  hasRepository: false,
  [init]() {
    this.vis = new Visualisation();
  },
  [readOn]() {
    if (!this.hasWorkingDirectory) {
      this.workingDirectory = new VisualisationArea('Working Directory');

      this.fileList = new VisualisationFileList();

      this.fileList.add(
        new VisualisationFile(),
        new VisualisationFile(),
        new VisualisationFile(),
      );

      this.fileList.files.forEach((file, index) => {
        file.status = STATUS_MODIFIED;
        file.modify();
      });

      this.workingDirectory.add(this.fileList);
      this.vis.add(this.workingDirectory);

      this.hasWorkingDirectory = true;
    } else if(!this.hasStagingArea) {
      this.stagingArea = new VisualisationArea('Staging Area');
      this.stagingArea.column = 1;

      this.stagedFileList = this.fileList.copy();

      this.fileList.files.forEach((file, index) => {
        file.reset();
      });

      this.stagingArea.add(this.stagedFileList);
      this.vis.add(this.stagingArea);

      this.hasStagingArea = true;
    } else if(!this.hasRepository) {
      this.repository = new VisualisationRepository();
      this.repository.column = 2;
      this.repository.height = 10;
      this.repository.width = 4;

      this.commit = new VisualisationCommit();
      this.commit.add(...this.stagedFileList.files);

      this.repository.add(this.commit);
      this.vis.add(this.repository);
      this.hasRepository = true;
    } else {
      this.commit.directActive = true;
    }
  },
  sections: [
    new ChapterText(
      () => (
        <Fragment>
          Git is a version control system. It’s a software you can install on your computer to store <Tooltip name="version">versions</Tooltip> of your file. But instead of copying files and folders by hand, you store new snapshots of your whole project.
        </Fragment>
      ),
      { skip: true }
    ),
    new ChapterText(() => 'Let’s take a look at the different parts of Git.'),
    new ChapterText(() => (
      <Fragment>
        First, there is the <strong>working directory</strong>, the folder on your computer where all the files and folders of your project are stored in. Here you add, modify or delete files with other software like you are used to.
      </Fragment>
    )),
    new ChapterText(() => (
      <Fragment>
        The second part is the <strong>staging area</strong>. Despite its name, it‘s not about showing something to others, but instead collect changes to your project you want to be part of your next version. This way you are able to group changes into seperate version, e.g. by feature or topic.
      </Fragment>
    )),
    new ChapterText(() => (
      <Fragment>
        Last but not least comes the <strong>repository</strong>. Broadly speaking, it's the version database of your project. All three parts of the project are stored on your computer. Only the repository is shared with others for colaboration.
      </Fragment>
    )),
    new ChapterText(() => (
      <Fragment>
        New <Tooltip name="version">versions</Tooltip> stored in the repository are called <strong>commits</strong>. Beside beeing a snapshot of the whole project at a certain point of time they also contain the author and date of the version, so you are able to log changes later on.
      </Fragment>
    )),
  ],
});

export default introductionChapter;
