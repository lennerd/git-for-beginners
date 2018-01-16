import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { extendObservable } from 'mobx';

import { ChapterText } from '../models/ChapterSection';
import TutorialChapter from './TutorialChapter';

@observer
class VersioningInGit extends Component {
  constructor(props) {
    super();

    const { chapter } = props;

    extendObservable(chapter, {
      get hasWorkingDirectory() {
        return this.visibleTextSections > 1;
      },
      get hasStagingArea() {
        return this.visibleTextSections > 2;
      },
      get hasRepository() {
        return this.visibleTextSections > 3;
      },
    });
  }

  render() {
    const { chapter, tutorial } = this.props;

    const sections = [
      new ChapterText(() => (
        'Git is a version control system. It’s a software you can install on your computer to store versions of your file. But instead of copying files and folders by hand, you store new snapshots of your whole project.'
      )),
      new ChapterText(() => 'Let’s take a look at the different parts of Git.', { skip: true }),
      new ChapterText(() => (
        'First, there is the Working Directory, the folder on your computer where all the files and folders of your project are stored in. Here you add, modify or delete files with other software like you are used to.'
      )),
    ];

    return (
      <TutorialChapter tutorial={tutorial} chapter={chapter} sections={sections}>
      </TutorialChapter>
    );
  }
}

export default VersioningInGit;

