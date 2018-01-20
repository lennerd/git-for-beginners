import React, { Fragment } from "react";

import { createChapter, init } from "../Chapter";
import { ChapterText, ChapterTask } from "../ChapterSection";
import Tooltip from "../../components/Tooltip";
import Visualisation from "../Visualisation";
import VisualisationFile, { createModifications } from "../VisualisationFile";
import { STATUS_DELETED, STATUS_ADDED } from "../../constants";
import ConsoleCommand from "../ConsoleCommand";
import { createAction } from "../Action";
import VisualisationCommit from "../VisualisationCommit";
import VisualisationStagingArea from "../VisualisationStagingArea";
import VisualisationRepository from "../VisualisationRepository";
import VisualisationWorkingDirectory from "../VisualisationWorkingDirectory";
import { VisualisationCommitReference, VisualisationFileReference } from "../../components/VisualisationObjectReference";
import Console from "../Console";
import Repository from "../Repository";
import GitVisualisation from "../vis/GitVisualisation";
import File from "../File";

const addFile = createAction('ADD_FILE');
const stageFile = createAction('STAGE_FILE');
const stageAllFiles = createAction('STAGE_ALL_FILES');
const unstageFile = createAction('UNSTAGE_FILE');
const deleteFile = createAction('DELETE_FILE');
const createCommit = createAction('CREATE_COMMIT');
const modifyFile = createAction('MODIFY_FILE');
const revertCommit = createAction('REVERT_COMMIT');

const versioningInGitChapter = createChapter('Versioning in Git', {
  head: null,
  get hasRevertedCommit() {
    return this.state.has(revertCommit);
  },
  get activeFile() {
    const activeVisFile = this.vis.visFiles.find(visFile => visFile.active);

    if (activeVisFile == null) {
      return null;
    }

    return activeVisFile.file;
  },
  /*
  get activeCommitIndex() {
    return this.repository.commits.find(commit => commit.active).nestedIndex;
  },
  */
  [init]() {
    this.repo = new Repository();

    this.vis = new GitVisualisation(this.repo);

    /*this.vis = new Visualisation();

    this.workingDirectoryFileList = new VisualisationCommit();
    this.stagingAreaFileList = new VisualisationCommit();

    this.workingDirectory = new VisualisationWorkingDirectory();
    this.workingDirectory.add(this.workingDirectoryFileList);

    this.stagingArea = new VisualisationStagingArea();
    this.stagingArea.column = 1;
    this.stagingArea.add(this.stagingAreaFileList);

    this.repository = new VisualisationRepository();
    this.repository.column = 2;
    this.repository.height = 10;
    this.repository.width = 4;

    this.vis.add(
      this.workingDirectory,
      this.stagingArea,
      this.repository,
    );

    const files = [
      new VisualisationFile(),
      new VisualisationFile(),
      new VisualisationFile()
    ];

    this.workingDirectoryFileList.add(
      ...files
    );*/

    this.console = new Console();

    this.console.add(
      new ConsoleCommand('Working Directory', {
        available: () => this.vis.workingDirectory.active,
        commands: [
          new ConsoleCommand('Stage all files.', {
            icon: '↗',
            message: () => 'All files were added to the staging area.',
            action: stageAllFiles,
          }),
        ],
      }),
      new ConsoleCommand('File', {
        available: () => this.vis.workingDirectory.active,
        commands: [
          new ConsoleCommand('Modify', {
            available: () => this.activeFile != null,
            icon: '+-',
            message: ({ data }) => (
              <Fragment>
                <VisualisationFileReference vis={this.vis} file={data}>File</VisualisationFileReference> was modified.
              </Fragment>
            ),
            action: modifyFile,
            payloadCreator: () => this.activeFile.name,
          }),
          new ConsoleCommand('Stage', {
            available: () => this.activeFile != null,
            icon: '↗',
            message: ({ data }) => (
              <Fragment>
                <VisualisationFileReference vis={this.vis} file={data}>File</VisualisationFileReference> was added to the staging area.
              </Fragment>
            ),
            action: stageFile,
            payloadCreator: () => this.activeFile.name
          }),
          new ConsoleCommand('Delete', {
            available: () => this.activeFile != null,
            icon: '×',
            message: ({ data }) => (
              <Fragment>
                <VisualisationFileReference vis={this.vis} file={data}>File</VisualisationFileReference> was deleted.
              </Fragment>
            ),
            action: deleteFile,
            payloadCreator: () => this.activeFile.name,
          })
        ],
      }),
      new ConsoleCommand('Staging Area', {
        available: () => this.vis.stagingArea.active,
        commands: [
          new ConsoleCommand('Create commit', {
            icon: '↗',
            message: ({ data }) => (
              <Fragment>
                New commit <VisualisationCommitReference vis={this.vis} commit={data} /> was stored in the repository.
              </Fragment>
            ),
            action: createCommit,
          }),
        ],
      }),
      new ConsoleCommand('File', {
        available: () => this.vis.stagingArea.active,
        commands: [
          new ConsoleCommand('Unstage', {
            icon: '↙',
            message: ({ data }) => (
              <Fragment>
                <VisualisationFileReference vis={this.vis} file={data}>File</VisualisationFileReference> was removed from the staging area.
              </Fragment>
            ),
            action: unstageFile,
            payloadCreator: () => this.activeFile.name,
          }),
        ],
      }),
      new ConsoleCommand('Repository', {
        available: () => this.vis.repository.active,
        commands: [
          new ConsoleCommand('Revert commit', {
            icon: '↙',
            message: ({ data }) => (
              <Fragment>
                Commit <VisualisationCommitReference vis={this.vis} commit={data} /> was revereted successfully.
              </Fragment>
            ),
            action: revertCommit,
            payloadCreator: () => this.activeFile.name,
          }),
        ],
      }),
      new ConsoleCommand('Add new file.', {
        icon: '+',
        message: ({ data }) => (
          <Fragment>
            A new <VisualisationFileReference vis={this.vis} file={data}>file</VisualisationFileReference> was added.
          </Fragment>
        ),
        action: addFile,
      }),
    );
  },
  [addFile]() {
    const file = File.create();

    this.repo.workingDirectory.addFile(file);

    return file;
  },
  /*stageFile(file) {
    let stagedFile = this.stagingAreaFileList.findCopies(file)[0];

    if (stagedFile != null && file.status === stagedFile.status && !file.modified) {
      throw () => 'File already staged.';
    }

    if (file.status !== STATUS_ADDED && file.status !== STATUS_DELETED && !file.modified) {
      throw () => 'Only modified files can be staged.';
    }

    if (stagedFile == null) {
      stagedFile = file.copy();
      this.stagingAreaFileList.add(stagedFile);
      this.stagingAreaFileList.sortBy(file => (
        this.workingDirectoryFileList.findCopies(file)[0].index
      ));
    } else {
      stagedFile.merge(file);
    }

    if (file.status !== STATUS_DELETED) {
      file.reset();
    } else {
      file.visible = false;
      stagedFile.visible = this.repository.findCopies(stagedFile).length > 0;
    }

    return stagedFile;
  },*/
  [stageFile](fileName) {
    const file = this.vis.files.find(file => file.name === fileName);

    this.repo.stageFile(file);

    return file;
  },
  [stageAllFiles]() {
    /*let files = this.workingDirectoryFileList.files;

    files.forEach(file => {
      try {
        this.stageFile(file);
      } catch (e) {
        console.error(e);
      }
    });*/
    throw new Error('Not yet.');
  },
  [unstageFile](fileName) {
    const file = this.vis.files.find(file => file.name === fileName);

    this.repo.unstageFile(file);

    return file;
  },
  [deleteFile](fileName) {
    const file = this.vis.files.find(file => file.name === fileName);

    this.repo.workingDirectory.removeFile(file);

    return file;
  },
  [modifyFile](fileName) {
    throw new Error('Not yet.');
    /*const file = this.vis.at(...fileName);

    file.insertions += insertions;
    file.deletions += deletions;

    return file;*/
  },
  [createCommit]() {
    throw new Error('Not yet.');
    /*const lastCommit = this.repository.commits[this.repository.commits.length - 1];
    let commit;

    if (lastCommit == null) {
      commit = new VisualisationCommit();
    } else {
      commit = lastCommit.copy();

      commit.files.forEach(file => {
        if (file.status === STATUS_DELETED) {
          file.visible = false;
        }

        const stagedFile = this.stagingAreaFileList.findCopies(file)[0];

        if (stagedFile != null) {
          file.reset(stagedFile);
          // @IDEA for animation later: copy also already existing files (copies) into commit and ignore copies while calculating the level.
          this.stagingAreaFileList.remove(stagedFile);
        } else {
          file.reset();
        }
      });

      commit.parentCommit = lastCommit;
    }

    commit.add(
      ...this.stagingAreaFileList.files,
    );

    this.repository.add(commit);
    this.head = commit;

    return commit;*/
  },
  [revertCommit](commitIndex) {
    throw new Error('Not yet.');
    /*const commit = this.vis.at(...commitIndex);

    let parentCommit = this.head;

    while (parentCommit != null) {
      parentCommit.files.forEach(file => {
        const baseFile = this.workingDirectoryFileList.findCopies(file)[0];

        baseFile.revert(file);
      });

      if (parentCommit === commit) {
        break;
      }

      parentCommit = parentCommit.parentCommit;
    }

    return commit;*/
  },
  get sections() {
    return [
      new ChapterText(() => (
        <Fragment>
          Let’s take a look at how a <Tooltip name="commit">commit</Tooltip> is created.
        </Fragment>
      )),
      new ChapterTask(() => (
        <Fragment>Add files to the <Tooltip name="stagingArea">staging area</Tooltip>.</Fragment>
      ), true),//this.stagingAreaFileList.files.length > 0 || this.repository.commits.length > 0),
      new ChapterText(() => (
        <Fragment>
          Did you see how files moved from the <Tooltip name="workingDirectory">working directory</Tooltip> to the staging area? These files changes are ready to be part of the next version, the next commit. <em>You can add more files, if you want. The stage is yours, actually.</em>
        </Fragment>
      ), { skip: true }),
      new ChapterTask(() => 'Create a new commit.', true),//this.repository.commits.length > 0),
      new ChapterText(() => (
        <Fragment>
          Perfect. A new commit was created and added to the <Tooltip name="repository">repository</Tooltip>. Like we said, each commit has a unique identifier, so we can reference it for example in the interactive menu below the visualisation.
        </Fragment>
      ), { skip: true }),
      new ChapterTask(() => 'Create at least two more commits.', true),//this.repository.commits.length > 2),
      new ChapterText(() => 'Now that we have a few more versions of our project, let’s take a look at how to restore an older version.', { skip: true }),
      new ChapterTask(() => 'Revert changes from a commit.', true),//this.hasRevertedCommit),
      new ChapterText(() => (
        <Fragment>
          Well done! A few commits were created and an older version of your project restored. <em>Go ahead and play around with your git powered project a little more.</em> Or jump directly to the …
        </Fragment>
      ), { skip: true }),
    ];
  },
});

export default versioningInGitChapter;
