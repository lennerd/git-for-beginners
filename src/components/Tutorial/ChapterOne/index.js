import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer, inject } from 'mobx-react';
import { TimelineLite } from 'gsap';
import { Redirect } from 'react-router-dom';

import Chapter, { ChapterText, ChapterButton } from '../Chapter';
import Visualisation from '../../Visualisation';
import File from '../../Visualisation/File';
import FileLabel from '../../Visualisation/FileLabel';
import FileModel from '../../Visualisation/models/File';

const ACTION_ADD_FIRST_FILE = Symbol('ADD_FIRST_FILE');
const ACTION_COPY_LAST_FILE = Symbol('COPY_LAST_FILE');
const ACTION_LOOP = Symbol('LOOP');
const ACTION_ADD_FILENAMES = Symbol('ADD_FILENAMES');
const ACTION_NEXT = Symbol('NONE');

const FILE_NAME_VARIANTS = [
  '_final',
  '_final_final',
  '_final_v2_final',
  '_final_forreal',
  '_finaaal',
  '_finalalal',
  '_final_hahaha',
  '_final_ineedhelp',
  '_final_itsatrap',
];

@inject('chapter')
@observer
class ChapterOne extends Component {
  @observable files = [];
  @observable newVersion = false;
  @observable action = ACTION_ADD_FIRST_FILE;
  @observable useVersioning = false;
  @observable versions = 0;
  @observable redirect = false;

  componentDidMount() {
    this.copyTimeline = new TimelineLite({
      paused: true,
      onComplete() {
        this.restart();
      }
    });

    this.copyTimeline.add(this.copyLastFile, '+=1.5');
  }

  componentWillUnmount() {
    this.copyTimeline.kill();
  }

  @action.bound addFirstFile() {
    const file = new FileModel();
    file.column = 0;
    file.appear = true;

    this.files.push(file);
  }

  @action.bound copyLastFile() {
    this.files.forEach((file) => {
      file.column++;
    });

    const file = this.files[0].copy();
    file.column = 0;
    file.appear = false;

    if (this.useVersioning) {
      const version = ++this.versions;

      file.name = 'file';

      const variantVersion = version - 2;

      if (variantVersion >= 0) {
        const variant = FILE_NAME_VARIANTS[variantVersion % FILE_NAME_VARIANTS.length];

        file.name += variant;
      }
    }

    // file.name += '.md';

    this.files.unshift(file);
    this.files.splice(6);
  }

  @action.bound handleNext() {
    const { chapter } = this.props;

    if (this.action === ACTION_ADD_FIRST_FILE) {
      this.addFirstFile();
      this.action = ACTION_COPY_LAST_FILE;
      chapter.progress = 0.25;

      return;
    }

    if (this.action === ACTION_COPY_LAST_FILE) {
      this.copyLastFile();
      this.action = ACTION_LOOP;
      chapter.progress = 0.5;

      return;
    }

    if (this.action === ACTION_LOOP) {
      this.copyTimeline.seek(2);
      this.copyTimeline.play();
      this.action = ACTION_ADD_FILENAMES;
      chapter.progress = 0.75;

      return;
    }

    if (this.action === ACTION_ADD_FILENAMES) {
      this.useVersioning = true;
      this.action = ACTION_NEXT;
      chapter.progress = 1;

      return;
    }

    if (this.action === ACTION_NEXT) {
      this.redirect = true;
    }
  }

  renderText() {
    if (this.action === ACTION_ADD_FIRST_FILE) {
      return (
        <ChapterText half>
          <p>So Git can be used to make version of you files. Okay, but what is a version? Let’s check the basics first.</p>
          <p>Everything starts with a file. Maybe a small text file we put together to write a application for a new job. Or a draft for a new exciting project.</p>
          <ChapterButton onClick={this.handleNext}>Create a new file.</ChapterButton>
        </ChapterText>
      );
    }

    if (this.action === ACTION_COPY_LAST_FILE) {
      return (
        <ChapterText half>
          <p>After a bunch of work on our file a few hours later, we rethought some parts of it.</p>
          <p>To be safe, we decide to create a backup file, which is nothing more than creating.</p>
          <p>To make a new version the file, we simply make a copy of it.</p>
          <ChapterButton onClick={this.handleNext}>Create a copy.</ChapterButton>
        </ChapterText>
      );
    }

    if (this.action === ACTION_LOOP) {
      return (
        <ChapterText half>
          <p>And this goes on, and on, and on.</p>
          <ChapterButton onClick={this.handleNext}>Start</ChapterButton>
        </ChapterText>
      );
    }

    if (this.action === ACTION_ADD_FILENAMES) {
      return (
        <ChapterText half>
          <p>And this goes on, and on, and on.</p>
          <ChapterButton onClick={this.handleNext}>Start</ChapterButton>
        </ChapterText>
      );
    }

    if (this.action === ACTION_NEXT) {
      return (
        <ChapterText half>
          <p>And this goes on, and on, and on.</p>
          <ChapterButton onClick={this.handleNext}>Start</ChapterButton>
        </ChapterText>
      );
    }
  }

  render() {
    const { font, chapter, ...props } = this.props;

    const files = this.files.map(file => (
      <File column={file.column} appear={file.appear} key={file.id}>
        {file.name && <FileLabel font={font} label={file.name} />}
      </File>
    ));

    return (
      <Chapter chapter={chapter} {...props}>
        {this.redirect && <Redirect to={`/chapter/${chapter.id + 1}`} />}
        {this.renderText()}
        <Visualisation>
          {files}
        </Visualisation>
      </Chapter>
    );
  }
}

export default ChapterOne;
