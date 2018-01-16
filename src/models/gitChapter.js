import React, { Fragment } from "react";

import { createChapter, readOn } from "./Chapter";
import { ChapterText } from "./ChapterSection";
import Tooltip from "../components/Tooltip";
import { hasMin } from "./Action";
import Visualisation from "./Visualisation";
import VisualisationArea from "./VisualisationArea";
import VisualisationFile from "./VisualisationFile";
import { STATUS_MODIFIED } from "../constants";
import VisualisationFileList from "./VisualisationFileList";
import VisualisationCommit from "./VisualisationCommit";

const introductionChapter = createChapter('Git', {
  hasWorkingDirectory: hasMin(readOn, 1),
  hasStagingArea: hasMin(readOn, 2),
  hasRepository: hasMin(readOn, 3),
  get vis() {
    const fileLists = [];
    const areas = [];
    const commits = [];

    if (this.hasWorkingDirectory) {
      const workingDirectory = new VisualisationArea();
      workingDirectory.name = 'Working Directory';

      areas.push(workingDirectory);

      const fileList = new VisualisationFileList();

      fileList.files.push(
        new VisualisationFile(),
        new VisualisationFile(),
        new VisualisationFile(),
      );

      fileLists.push(fileList);

      fileList.files.forEach((file, index) => {
        file.level = index;
        file.status = STATUS_MODIFIED;
        file.modify();
      });
    }

    if (this.hasStagingArea) {
      const stagingArea = new VisualisationArea();
      stagingArea.name = 'Staging Area';
      stagingArea.column = 1;

      areas.push(stagingArea);

      const stagedFileList = fileLists[0].copy();
      stagedFileList.column = 1;

      fileLists.push(stagedFileList);

      fileLists[0].files.forEach((file, index) => {
        file.reset();
      });
    }

    if (this.hasRepository) {
      const repository = new VisualisationArea();
      repository.name = 'Repository';
      repository.column = 2;
      repository.height = 10;
      repository.width = 4;

      areas.push(repository);

      const commit = new VisualisationCommit();

      commit.files.push(
        ...fileLists[1].files,
      );

      commit.column = 2;
      commits.push(commit);

      fileLists.splice(1, 1);
    }

    const vis = new Visualisation();
    vis.areas = areas;
    vis.fileLists = fileLists;
    vis.commits = commits;

    return vis;
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
        First, there is the <strong>Working Directory</strong>, the folder on your computer where all the files and folders of your project are stored in. Here you add, modify or delete files with other software like you are used to.
      </Fragment>
    )),
    new ChapterText(() => (
      <Fragment>
        The second part is the <strong>Staging Area</strong>. Despite its name, it‘s not about showing something to others, but instead collect changes to your project you want to be part of your next version. This way you are able to group changes into seperate version, e.g. by feature or topic.
      </Fragment>
    )),
    new ChapterText(() => (
      <Fragment>
        Last but not least comes the <strong>Repository</strong>. Broadly speaking, this is the version database of your project.
      </Fragment>
    )),
  ],
});

export default introductionChapter;
