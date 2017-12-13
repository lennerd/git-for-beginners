import React from 'react';
import { observable, action } from 'mobx';
import { TimelineLite } from 'gsap';

import letterSpacing from '../../../fonts/letterSpacing';
import Story, { ACTION_NEXT } from './Story';
import Visualisation from '../../Visualisation';
import File from '../../Visualisation/File';
import Section from '../../Visualisation/Section';
import SectionLabel from '../../Visualisation/SectionLabel';
import Commit from '../../Visualisation/Commit';
import Popup from '../../Visualisation/Popup';
import FileModel from '../../Visualisation/models/File';
import CommitModel from '../../Visualisation/models/Commit';
import { STATUS_MODIFIED } from '../../Visualisation/models/FileStatus';

class VersioningInGit extends Story {
  @observable commits = [];

  constructor(fontRegular, fontBold, randomAuthors) {
    super({ half: true });

    this.add(ACTION_NEXT);

    this.fontRegular = fontRegular;
    this.fontBold = letterSpacing(fontBold, 1.2);
    this.sectionLabelFont = letterSpacing(fontRegular, 1.2);

    this.randomAuthors = randomAuthors;

    this.copyTimeline = new TimelineLite({
      onComplete() {
        this.restart();
      }
    });

    this.addFirstCommit();
    this.copyTimeline.add(this.copyLastCommit.bind(this), '+=1.5');
  }

  @action addFirstCommit() {
    const commit = new CommitModel();
    const authorIndex = Math.round(Math.random() * (this.randomAuthors.length - 1));

    const author = this.randomAuthors[authorIndex];

    commit.author = author.name;

    for (let i = 0; i < 5; i++) {
      const file = new FileModel();

      file.status.type = STATUS_MODIFIED;
      file.status.insertions = Math.round(Math.random() * 20);
      file.status.deletions = Math.round(Math.random() * 20);

      commit.add(file);
    }

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

    for (let file of commit.children) {
      file.status.type = STATUS_MODIFIED;
      file.status.insertions = Math.round(Math.random() * 20);
      file.status.deletions = Math.round(Math.random() * 20);
    }

    this.commits.unshift(commit);
    this.commits.splice(10);
  }

  write() {

  }

  visualise() {
    const commits = this.commits.map(commit => (
      <Commit column={commit.column} row={commit.row} key={commit.id}>
        {
          commit.column > 0 &&
          <Popup
            appear
            font={this.fontRegular}
            label={`Date: ${commit.date}\nAuthor: ${commit.author}`}
            level={commit.children.length}
          />
        }
        {commit.children.map((file, index) => (
          <File key={file.id} level={index} font={this.fontBold} status={file.status} />
        ))}
      </Commit>
    ));

    return (
      <Visualisation>
        {commits}
        <Section height="10" column="1" appear>
          <SectionLabel font={this.sectionLabelFont} label="REPOSITORY" appear />
        </Section>
      </Visualisation>
    );
  }
}

export default VersioningInGit;
