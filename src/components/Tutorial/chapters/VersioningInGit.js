import React from 'react';
import { observable, action } from 'mobx';
import { TimelineLite } from 'gsap';

import Story, { ACTION_NEXT } from './Story';
import ChapterButton from '../Chapter/ChapterButton';
import ChapterText from '../Chapter/ChapterText';
import Visualisation from '../../Visualisation';
import File from '../../Visualisation/File';
import Section from '../../Visualisation/Section';
import FileLabel from '../../Visualisation/FileLabel';
import SectionLabel from '../../Visualisation/SectionLabel';
import FileModel from '../../Visualisation/models/File';
import letterSpacing from '../../../fonts/letterSpacing';

const ACTION_ADD_FIRST_FILE = Symbol('ADD_FIRST_FILE');
const ACTION_COPY_LAST_FILE = Symbol('COPY_LAST_FILE');
const ACTION_LOOP = Symbol('LOOP');
const ACTION_ADD_FILENAMES = Symbol('ADD_FILENAMES');
const ACTION_ADD_VERSION_DATABASE = Symbol('USE_VERSION_DATABASE');

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

class VersioningInGit extends Story {
  @observable files = [];
  @observable useFileNames = false;
  @observable useVersionDatabase = false;
  @observable versions = 0;

  constructor(font) {
    super();

    this.add(ACTION_ADD_FIRST_FILE, this.addFirstFile);
    this.add(ACTION_COPY_LAST_FILE, this.copyLastFile);
    this.add(ACTION_LOOP, this.loop);
    this.add(ACTION_ADD_FILENAMES, this.addFileNames);
    this.add(ACTION_ADD_VERSION_DATABASE, this.addVersionDatabase);
    this.add(ACTION_NEXT);

    this.fileLabelFont = font;
    this.sectionLabelFont = letterSpacing(font, 1.2);

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
    if (this.useVersionDatabase) {
      this.files.forEach((file) => {
        if (file.column === 0) {
          file.column = 1;
        } else {
          file.row++;
        }
      });
    } else {
      this.files.forEach((file) => {
        file.column++;
      });
    }

    const file = this.files[0].copy();
    file.column = 0;
    file.row = 0;
    file.appear = false;

    if (this.useFileNames) {
      file.name = 'file';

      if (!this.useVersionDatabase) {
        const version = ++this.versions;

        const variantVersion = version - 2;

        if (variantVersion >= 0) {
          const variant = FILE_NAME_VARIANTS[variantVersion % FILE_NAME_VARIANTS.length];

          file.name += variant;
        }
      }
    }

    this.files.unshift(file);
    this.files.splice(10);
  }

  @action loop() {
    this.copyTimeline.seek(2);
    this.copyTimeline.play();
  }

  @action addFileNames() {
    this.useFileNames = true;
  }

  @action addVersionDatabase() {
    this.useVersionDatabase = true;

    this.files.forEach((file, index) => {
      file.column = index === 0 ? 0 : 1;
      file.row = index <= 1 ? 0 : (index - 1);
      file.name = 'file';

      this.copyTimeline.restart();
    });
  }

  write() {
    if (this.will(ACTION_ADD_FIRST_FILE)) {
      return (
        <ChapterText half>
          <p>As a VCS Git is able to store version of my files. Okay, nice. But what is a version after all?</p>
          <p>Let’s take a step back and a look at a typical way versions are created on many computers out there.</p>
          <p>Everything starts with a file. Maybe a small text file we put together to review the last project meeting. Or a draft for a new exciting project.</p>
          <ChapterButton>Create a New file</ChapterButton>
        </ChapterText>
      );
    }

    if (this.will(ACTION_COPY_LAST_FILE)) {
      return (
        <ChapterText half>
          <p>After a while we come back. We got some new ideas, a chapter of the text we want to try to make better this time.</p>
          <p>We could of course make the changes directly in our file. But that would mean we would lose the last version of the text. So we create a copy of the file as a backup.</p>
          <ChapterButton>Create a Copy</ChapterButton>
        </ChapterText>
      );
    }

    if (this.will(ACTION_LOOP)) {
      return (
        <ChapterText half>
          <p>Every once in a while you add new changes to your file and create a new copy of the file as a backup.</p>
          <ChapterButton>Add Ideas and Feedback</ChapterButton>
        </ChapterText>
      );
    }

    if (this.will(ACTION_ADD_FILENAMES)) {
      return (
        <ChapterText half>
          <p>This goes on, and on, and on, …</p>
          <p>But how do we distinguish between all these files? Many people use the file name. Couldn’t be bad, right? Let’s do it too.</p>
          <ChapterButton>Add Filenames</ChapterButton>
        </ChapterText>
      );
    }

    if (this.will(ACTION_ADD_VERSION_DATABASE)) {
      return (
        <ChapterText half>
          <p>Okay, now we getting ridiculous. But you get the idea, right?</p>
          <p>Of course, there are better ways to organise version of files. We could of course use proper names based on the current date of time or a simple counter. But there is an even better solution.</p>
          <ChapterButton>Use a Version Database</ChapterButton>
        </ChapterText>
      );
    }

    if (this.will(ACTION_NEXT)) {
      return (
        <ChapterText half>
          <p>VCS use version databases to store versions of files. They often also store a date or the author of last made changes.</p>
          <p>Let’s take a look at the version database in Git.</p>
          <ChapterButton>Versioning in Git</ChapterButton>
        </ChapterText>
      );
    }
  }

  visualise() {
    const files = this.files.map(file => (
      <File column={file.column} row={file.row} appear={file.appear} key={file.id}>
        {
          file.name &&
          <FileLabel
            font={this.fileLabelFont}
            label={file.name}
            appear
          />
        }
      </File>
    ));

    return (
      <Visualisation>
        {
          this.useVersionDatabase &&
          <Section height="10" column="1" appear>
            <SectionLabel font={this.sectionLabelFont} label="VERSION DATABASE" appear />
          </Section>
        }
        {files}
      </Visualisation>
    );
  }
}

export default VersioningInGit;
