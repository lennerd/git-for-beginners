import React, { Fragment } from "react";
import { extendObservable, computed } from 'mobx';

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
    const vis = new Visualisation();

    const workingDirectory = new VisualisationArea();
    workingDirectory.name = 'Working Directory';

    const stagingArea = new VisualisationArea();
    stagingArea.name = 'Staging Area';
    stagingArea.column = 1;

    const repository = new VisualisationArea();
    repository.name = 'Repository';
    repository.column = 2;
    repository.height = 10;
    repository.width = 4;

    const workingDirectoryFileList = new VisualisationFileList();

    workingDirectoryFileList.files.push(
      new VisualisationFile(),
      new VisualisationFile(),
      new VisualisationFile(),
    );

    workingDirectoryFileList.files.forEach((file, index) => {
      file.level = index;
      file.status = STATUS_MODIFIED;
      file.modify();
    });

    const stagedFileList = workingDirectoryFileList.copy();
    stagedFileList.column = 1;

    const commit = new VisualisationCommit();
    commit.column = 2;

    commit.files.push(
      ...stagedFileList.files,
    );

    extendObservable(vis, {
      areas: computed(() => {
        const areas = [];

        if (this.hasWorkingDirectory) {
          areas.push(workingDirectory);
        }

        if (this.hasStagingArea) {
          areas.push(stagingArea);
        }

        if (this.hasRepository) {
          areas.push(repository);
        }

        return areas;
      }),

      fileLists: computed(() => {
        const fileLists = [];

        if (this.hasWorkingDirectory) {
          fileLists.push(workingDirectoryFileList);
        }

        if (this.hasStagingArea && !this.hasRepository) {
          fileLists.push(stagedFileList);
        }

        return fileLists;
      }),

      commits: computed(() => {
        const commits = [];

        if (this.hasRepository) {
          commits.push(commit);
        }

        return commits;
      })
    });

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
        Last but not least comes the <strong>repository</strong>. Broadly speaking, this is the version database of your project.
      </Fragment>
    )),
    new ChapterText(() => (
      <Fragment>
        New <Tooltip name="version">versions</Tooltip> stored in the repository are called as a <strong>commit</strong>. Beside a snapshot of the project they also contain the author and date of the version, so you are able to log changes later on.
      </Fragment>
    )),
  ],
});

export default introductionChapter;
