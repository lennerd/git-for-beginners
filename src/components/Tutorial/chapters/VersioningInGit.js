import React, { Fragment } from 'react';
import { observable, action } from 'mobx';
//import { TweenLite, TimelineLite } from 'gsap';

import letterSpacing from '../../../fonts/letterSpacing';
import Story, { ACTION_NEXT } from './Story';
import Visualisation from '../../Visualisation';
import File from '../../Visualisation/File';
import FileStatus from '../../Visualisation/FileStatus';
import Section from '../../Visualisation/Section';
import SectionLabel from '../../Visualisation/SectionLabel';
import Commit from '../../Visualisation/Commit';
import Popup from '../../Visualisation/Popup';
import FileModel from '../../Visualisation/models/File';
import CommitModel from '../../Visualisation/models/Commit';
import { STATUS_DELETED, STATUS_ADDED, STATUS_MODIFIED } from '../../Visualisation/models/FileStatus';

class VersioningInGit extends Story {
  @observable commits = [];

  constructor(fontRegular, fontBold, randomAuthors) {
    super({ half: true });

    this.add(ACTION_NEXT);

    this.fontRegular = fontRegular;
    this.fontBold = letterSpacing(fontBold, 1.2);
    this.sectionLabelFont = letterSpacing(fontRegular, 1.2);

    this.randomAuthors = randomAuthors;

    /*this.copyTimeline = new TimelineLite({
      onComplete() {
        this.restart();
      }
    });*/

    //this.addFirstCommit();
    //this.copyTimeline.add(this.copyLastCommit.bind(this), '+=1.5');
  }

  /*@action addFirstCommit() {
    const commit = new CommitModel();
    const authorIndex = Math.round(Math.random() * (this.randomAuthors.length - 1));

    const author = this.randomAuthors[authorIndex];
    commit.author = author.name;

    const file = new FileModel();
    file.appear = true;
    commit.add(file);

    this.commits.push(commit);
  }

  @action.bound copyLastCommit() {
    this.commits.forEach((commit, index) => {
      commit.column = 1;
      commit.row = index;
    });

    const authorIndex = Math.round(Math.random() * (this.randomAuthors.length - 1));
    const author = this.randomAuthors[authorIndex];

    const commit = this.commits[0].clone();
    commit.column = 0;
    commit.row = 0;
    commit.author = author.name;

    this.commits.unshift(commit);
    this.commits.splice(10);

    TweenLite.delayedCall(0.8, this.addChanges);
  }

  @action.bound addChanges() {
    const commit = this.commits[0];

    for (let [index, file] of commit.children.entries()) {
      if (file.status.type === STATUS_DELETED) {
        commit.children.splice(index, 1);
      } else {
        file.modify();
      }
    }

    while (Math.random() > 0.7) {
      const file = new FileModel();
      commit.add(file);
    }

    let children = commit.children.length;

    while (Math.random() > 0.7 && children > 1) {
      const index = Math.round(Math.random() * (commit.children.length - 1));
      const file = commit.children[index];

      file.status.type = STATUS_DELETED;
      children--;
    }
  }*/

  @action.bound addFile() {
    let commit = this.commits[0];

    if (commit == null) {
      commit = new CommitModel();

      const authorIndex = Math.round(Math.random() * (this.randomAuthors.length - 1));
      const author = this.randomAuthors[authorIndex];
      commit.author = author.name;

      commit.column = 0;
      commit.row = 0;

      this.commits.push(commit);
    }

    const file = new FileModel();
    commit.add(file);

    return true;
  }

  @action.bound deleteFile() {
    let commit = this.commits[0];

    if (commit == null) {
      return false;
    }

    const files = commit.children.filter(file => file.status.type !== STATUS_DELETED);

    if (files.length === 0) {
      return false;
    }

    const randomIndex = Math.round(Math.random() * (files.length - 1));
    const file = files[randomIndex];

    if (file.status.type === STATUS_ADDED) {
      commit.remove(file);
    }

    file.status.type = STATUS_DELETED;

    return true;
  }

  @action.bound modifyFile() {
    if (this.commits.length === 0) {
      return false;
    }

    const commit = this.commits[0];
    const files = commit.children.filter(file => file.status.type !== STATUS_DELETED);

    if (files.length === 0) {
      return false;
    }

    const randomIndex = Math.round(Math.random() * (files.length - 1));
    const file = files[randomIndex];

    const changes = Math.round(Math.random() * 100);
    const insertions = Math.round(changes * Math.random());
    const deletions = changes - insertions;

    file.status.insertions += insertions;
    file.status.deletions += deletions;

    return true;
  }

  @action.bound createCommit() {
    if (this.commits.length === 0) {
      return false;
    }

    const firstCommit = this.commits[0];

    if (!firstCommit.hasChanges) {
      return false;
    }

    const newCommit = firstCommit.clone();
    newCommit.prevColumn = firstCommit.column;
    newCommit.prevRow = firstCommit.row;
    this.commits.splice(1, 0, newCommit);

    for (let [index, commit] of this.commits.entries()) {
      commit.column = index === 0 ? 0 : 1;
      commit.row = index === 0 ? 0 : index - 1;
    }

    const authorIndex = Math.round(Math.random() * (this.randomAuthors.length - 1));
    const author = this.randomAuthors[authorIndex];
    firstCommit.author = author.name;

    for (let file of firstCommit.children) {
      if (file.status.type === STATUS_DELETED) {
        firstCommit.children.remove(file);
        continue;
      }

      file.status.type = STATUS_MODIFIED;
      file.status.insertions = 0;
      file.status.deletions = 0;
    }

    return true;
  }

  write() {
    return (
      <Fragment>
        <button onClick={this.addFile}>Add File</button>
        <button onClick={this.modifyFile}>Modify File</button>
        <button onClick={this.deleteFile}>Delete File</button>
        <button onClick={this.createCommit}>Create Snapshot</button>
      </Fragment>
    )
  }

  unmount() {
    //this.copyTimeline.kill();
  }

  visualise() {
    const commits = this.commits.map((commit, commitIndex) => (
      <Commit
        prevColumn={commit.prevColumn}
        prevRow={commit.prevRow}
        column={commit.column}
        row={commit.row}
        key={commit.id}
      >
        {commit.column > 0 && <Popup
          appear
          font={this.fontRegular}
          label={`Date: ${commit.date}\nAuthor: ${commit.author}`}
          level={commit.children.length}
        />}
        {commit.children.map((file, fileIndex) => (
          <File
            key={file.id}
            level={fileIndex}
            statusType={file.status.type}
            appear={commitIndex === 0 && file.status.type === STATUS_ADDED}
            changes={file.status.changes}
          >
            <FileStatus
              font={this.fontBold}
              type={file.status.type}
              insertions={file.status.insertions}
              deletions={file.status.deletions}
              maxChanges={commit.maxChanges}
            />
          </File>
        ))}
      </Commit>
    ));

    return (
      <Visualisation>
        {commits}
        <Section height="10" column="1">
          <SectionLabel font={this.sectionLabelFont} label="REPOSITORY" appear />
        </Section>
      </Visualisation>
    );
  }
}

export default VersioningInGit;
