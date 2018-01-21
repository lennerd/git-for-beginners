import React, { Fragment } from "react";

import { createChapter, readOn, init } from "../Chapter";
import { ChapterText } from "../ChapterSection";
import Tooltip from "../../components/Tooltip";
import GitVisualisation from "../vis/GitVisualisation";
import Repository from "../Repository";
import File from "../File";

const introductionChapter = createChapter('Git', {
  [init]() {
    this.repo = new Repository();
    this.vis = new GitVisualisation(this.repo);

    this.files = [
      File.create(),
      File.create(),
      File.create()
    ];

    for (let file of this.files) {
      this.repo.workingDirectory.addFile(file);
    }

    this.vis.useRepository = false;
    this.vis.useStagingArea = false;
    this.vis.useWorkingDirectory = false;
  },
  [readOn]() {
    if (!this.vis.useWorkingDirectory) {
      this.vis.useWorkingDirectory = true;
    } else if(!this.vis.useStagingArea) {
      for (let file of this.files) {
        this.repo.stageFile(file);
      }

      this.vis.useStagingArea = true;
    } else if(!this.vis.useRepository) {
      this.repo.createCommit();

      this.vis.useRepository = true;
    } else {
      this.vis.repository.children[0].directActive = true;
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
        First, there is the <strong>working directory</strong>, the folder on your computer where all the files of your project are stored in. Here you add, modify or delete files with other software like you are used to.
      </Fragment>
    )),
    new ChapterText(() => (
      <Fragment>
        The second part is the <strong>staging area</strong>. Despite its name, it’s not about showing something to others, but instead collect changes to your project you want to be part of your next version. This way you are able to group changes into seperate version, e.g. by feature or topic.
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
