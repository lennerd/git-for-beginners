import React, { Fragment } from 'react';

import { createChapter, readOn, init } from '../Chapter';
import { ChapterText } from '../ChapterSection';
import Tooltip from '../../components/Tooltip';
import GitVisualisation from '../vis/GitVisualisation';
import Repository from '../Repository';

const gitChapter = createChapter('Introducing Git', {
  useWorkingDirectory: false,
  useStagingArea: false,
  useRepository: false,

  [init]() {
    this.repo = new Repository();
    this.vis = new GitVisualisation(this.repo);

    this.files = [this.vis.addFile(), this.vis.addFile(), this.vis.addFile()];

    this.vis.toggleWorkingDirectory();
    this.vis.toggleStagingArea();
    this.vis.toggleRepository();
  },
  [readOn]() {
    if (!this.useWorkingDirectory) {
      this.vis.toggleWorkingDirectory();
      this.useWorkingDirectory = true;
    } else if (!this.useStagingArea) {
      this.vis.toggleStagingArea();
      this.useStagingArea = true;
      this.vis.stageFile(0);
      this.vis.stageFile(1);
      this.vis.stageFile(2);
    } else if (!this.useRepository) {
      this.vis.toggleRepository();
      this.useRepository = true;

      this.vis.createCommit();
    } else {
      const commit = this.vis.repository.visCommits[0];

      if (commit != null) {
        commit.directActive = true;
      }
    }
  },
  sections: [
    new ChapterText(
      () => (
        <Fragment>
          Git is a version control system. It’s a software you can install on
          your computer to store <Tooltip name="version">versions</Tooltip> of
          your file. But instead of copying files and folders manually now you
          store new snapshots of your whole project.
        </Fragment>
      ),
      { skip: true },
    ),
    new ChapterText(() => 'Let’s take a look at the different parts of Git.'),
    new ChapterText(() => (
      <Fragment>
        First, there is the <strong>working directory</strong>. It‘s the folder
        on your computer where your project is located in, where you modify, add
        or delete files.
      </Fragment>
    )),
    new ChapterText(() => (
      <Fragment>
        The second part is the <strong>staging area</strong>. Despite its name,
        it’s not about showing something to others. Instead you can use the
        staging area to collect changes in the project that you want to store in
        the next version. By this you are able to group changes in your files
        into seperate versions, e.g. by feature or topic.
      </Fragment>
    )),
    new ChapterText(() => (
      <Fragment>
        Last not least there is the <strong>repository</strong>. Basically it is
        the <Tooltip name="versionDatabase">version database</Tooltip> of your
        project. The repository is shared with others by downloading from or
        uploading to a server or other team members. However, all three parts of
        your project are always stored on your computer.
      </Fragment>
    )),
    new ChapterText(() => (
      <Fragment>
        The new <Tooltip name="version">versions</Tooltip> in the repository are
        called <strong>commits</strong>. They are snapshots of the whole project
        at a certain point of time. But they also contain the author and date of
        the version, so you are able to get an overview of all changes later on.
      </Fragment>
    )),
  ],
});

export default gitChapter;
