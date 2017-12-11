import React from 'react';
import { observable, action } from 'mobx';
import { TimelineLite } from 'gsap';

import Story, { ACTION_NEXT } from './Story';
import ChapterButton from '../Chapter/ChapterButton';
import ChapterText from '../Chapter/ChapterText';
import Visualisation from '../../Visualisation';
import File from '../../Visualisation/File';
import FileLabel from '../../Visualisation/FileLabel';
import FileModel from '../../Visualisation/models/File';

const ACTION_ADD_FIRST_FILE = Symbol('ADD_FIRST_FILE');
const ACTION_COPY_LAST_FILE = Symbol('COPY_LAST_FILE');
const ACTION_LOOP = Symbol('LOOP');
const ACTION_ADD_FILENAMES = Symbol('ADD_FILENAMES');

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

class Introduction extends Story {
  @observable files = [];
  @observable useVersioning = false;

  constructor(font) {
    super();

    this.add(ACTION_ADD_FIRST_FILE, this.addFirstFile);
    this.add(ACTION_COPY_LAST_FILE, this.copyLastFile);
    this.add(ACTION_LOOP, this.loop);
    this.add(ACTION_ADD_FILENAMES, this.addFileNames);
    this.add(ACTION_NEXT);

    this.font = font;

    this.copyTimeline = new TimelineLite({
      paused: true,
      onComplete() {
        this.restart();
      }
    });

    this.copyTimeline.add(this.copyLastFile.bind(this), '+=1.5');
  }

  @action addFirstFile() {
    const file = new FileModel();
    file.column = 0;
    file.appear = true;

    this.files.push(file);
  }

  @action copyLastFile() {
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

    this.files.unshift(file);
    this.files.splice(6);
  }

  @action loop() {
    this.copyTimeline.seek(2);
    this.copyTimeline.play();
  }

  @action addFileNames() {
    this.useVersioning = true;
  }

  write() {
    if (this.will(ACTION_ADD_FIRST_FILE)) {
      return (
        <ChapterText half>
          <p>So Git can be used to make version of you files. Okay, but what is a version? Let’s check the basics first.</p>
          <p>Everything starts with a file. Maybe a small text file we put together to write a application for a new job. Or a draft for a new exciting project.</p>
          <ChapterButton>Create a new file.</ChapterButton>
        </ChapterText>
      );
    }

    if (this.will(ACTION_COPY_LAST_FILE)) {
      return (
        <ChapterText half>
          <p>After a bunch of work on our file a few hours later, we rethought some parts of it.</p>
          <p>To be safe, we decide to create a backup file, which is nothing more than creating.</p>
          <p>To make a new version the file, we simply make a copy of it.</p>
          <ChapterButton>Create a copy.</ChapterButton>
        </ChapterText>
      );
    }

    if (this.will(ACTION_LOOP)) {
      return (
        <ChapterText half>
          <p>And this goes on, and on, and on.</p>
          <ChapterButton>Start</ChapterButton>
        </ChapterText>
      );
    }

    if (this.will(ACTION_ADD_FILENAMES)) {
      return (
        <ChapterText half>
          <p>And this goes on, and on, and on.</p>
          <ChapterButton>Start</ChapterButton>
        </ChapterText>
      );
    }

    if (this.will(ACTION_NEXT)) {
      return (
        <ChapterText half>
          <p>Look at these file names.</p>
          <ChapterButton>Next chapter.</ChapterButton>
        </ChapterText>
      );
    }
  }

  visualise() {
    const files = this.files.map(file => (
      <File column={file.column} appear={file.appear} key={file.id}>
        {file.name && <FileLabel font={this.font} label={file.name} />}
      </File>
    ));

    return (
      <Visualisation>
        {files}
      </Visualisation>
    );
  }
}

export default Introduction;
