import React, { Fragment } from "react";

import { createChapter, init } from "../Chapter";
import { ChapterText, ChapterTask } from "../ChapterSection";
import Tooltip from "../../components/Tooltip";
import Console from "../Console";
import { VisualisationFileReference } from "../../components/VisualisationObjectReference";
import ConsoleCommand from "../ConsoleCommand";
import { createAction } from "../Action";
import { createStatusMessage, createCommitMessage } from "../vis/GitVisualisation";

const addFile = createAction('ADD_FILE');
const stageFile = createAction('STAGE_FILE');
const getStatus = createAction('GET_STATUS');
const createCommit = createAction('CREATE_COMMIT');
const revertCommit = createAction('REVERT_COMMIT');
const modifyFile = createAction('MODIFY_FILE');
const deleteFile = createAction('DELETE_FILE');

const gitInTheConsoleChapter = createChapter('Git in the Console', {
  inheritFrom: 'Versioning in Git',
  get activeVisFile() {
    return this.vis.visFiles.find(visFile => visFile.active);
  },
  get activeFile() {
    if (this.activeVisFile == null) {
      return null;
    }

    return this.activeVisFile.file;
  },
  get activeFileIndex() {
    return this.vis.files.indexOf(this.activeFile);
  },
  get activeVisCommit() {
    return this.vis.repository.find(object => object.isCommit && object.active);
  },
  get activeCommit() {
    if (this.activeVisCommit == null) {
      return null;
    }

    return this.activeVisCommit.commit;
  },
  sections: [
    new ChapterText(() => (
      <Fragment>
        Let’s create a few more <Tooltip name="commit">commits</Tooltip>. This time we use the console.
      </Fragment>
    )),
    new ChapterTask(() => (
      <Fragment>Select a file and use <code>git add</code> to add it to the <Tooltip name="stagingArea">staging area</Tooltip>.</Fragment>
    ), false, {
      tip: () => (
        <Fragment>
          The normal console won’t give you the visualisation you have here. No worries though. With <code>git status</code> you are able to see similar text based output.
        </Fragment>
      ),
    }),
  ],
  get vis() {
    return this.parent.vis;
  },
  [init]() {
    this.console = new Console({
      payloadElement: () => {
        if (this.activeVisFile != null) {
          return (
            <VisualisationFileReference vis={this.vis} file={this.activeVisFile}>file</VisualisationFileReference>
          );
        }

        return null;
      },
    });

    this.console.add(
      new ConsoleCommand('git add', {
        textOnly: true,
        action: stageFile,
        payloadCreator: () => this.activeFileIndex,
      }),
      new ConsoleCommand('git status', {
        textOnly: true,
        message: ({ data }) => (
          <pre>
            {createStatusMessage(this.vis, data)}
          </pre>
        ),
        action: getStatus,
      }),
      new ConsoleCommand('git commit', {
        textOnly: true,
        message: ({ data }) => (
          <pre>
            {createCommitMessage(this.vis, data)}
          </pre>
        ),
        action: createCommit,
        payloadCreator: () => this.activeFileIndex,
      }),
      new ConsoleCommand('git revert', {
        textOnly: true,
        message: ({ data }) => (
          null
        ),
        action: revertCommit,
        payloadCreator: () => this.activeFileIndex,
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
            payloadCreator: () => this.activeFileIndex,
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
            payloadCreator: () => this.activeFileIndex,
          })
        ],
      }),
    );
  },
  [addFile]() {
    return this.vis.addFile();
  },
  [stageFile](fileIndex) {
    return this.vis.stageFile(fileIndex);
  },
  [createCommit]() {
    return this.vis.createCommit();
  },
  [getStatus]() {
    return this.vis.getStatus();
  },
  [deleteFile](fileIndex) {
    return this.vis.deleteFile(fileIndex);
  },
  [modifyFile](fileIndex) {
    return this.vis.modifyFile(fileIndex);
  },
});

export default gitInTheConsoleChapter;
