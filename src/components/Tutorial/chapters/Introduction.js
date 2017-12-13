import React from 'react';
import { observable } from 'mobx';

import Story, { ACTION_NEXT } from './Story';
import ChapterButton from '../Chapter/ChapterButton';
import ChapterText from '../Chapter/ChapterText';

const ACTION_PROGRAMMERS = 'PROGRAMMERS';
const ACTION_WELCOME = 'WELCOME';

class Introduction extends Story {
  @observable files = [];
  @observable useVersioning = false;
  @observable versions = 0;

  constructor() {
    super();

    this.add(ACTION_PROGRAMMERS);
    this.add(ACTION_WELCOME);
    this.add(ACTION_NEXT);
  }

  write() {
    if (this.will(ACTION_PROGRAMMERS)) {
      return (
        <ChapterText key={ACTION_PROGRAMMERS}>
          <p>In the passed few decades Computer changed our daily life enormously. Eventually everyone is creating data in form of files to store everything from invoices to love letters, from code to illustrations and designs.</p>
          <p>With the raise of the internet we started to send around files via email and lost a few of them on the way. Than came the cloud and we started to create online backups of our data and to easily share our files with others.</p>
          <p>Although this is working great for many cases, a lot of things can happen and data is still lost on the way.</p>
          <ChapterButton>A no-go for programmers</ChapterButton>
        </ChapterText>
      );
    }

    if (this.will(ACTION_WELCOME)) {
      return (
        <ChapterText key={ACTION_WELCOME}>
          <p>A no-go for programmers. So they developed special kind of clouds called version control systems to share projects more easily and to have a strong base for working on a project cooperatively.</p>
          <p>Git is one of these tools. And although it’s used for programming a lot, it’s powerful enough to version control nearly every kind of file you can think of, even your invoices, meeting protocols and love letters.</p>
          <ChapterButton>Git for Beginners</ChapterButton>
        </ChapterText>
      );
    }

    if (this.will(ACTION_NEXT)) {
      return (
        <ChapterText key={ACTION_NEXT}>
          <p>Welcome to Git for Beginners, an interactive story and online course dedicated to non-programmers to learn Git and to be able to use it to version control your files.</p>
          <ChapterButton>Let's start!</ChapterButton>
        </ChapterText>
      );
    }
  }
}

export default Introduction;
