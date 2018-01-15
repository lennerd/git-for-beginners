import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { ChapterText } from '../models/ChapterSection';
import TutorialChapter from './TutorialChapter';

const SECTIONS = [
  new ChapterText(
    'Git is a version control system. It’s a software you can install on your computer to store versions of your file. But instead of copying files and folders by hand, you store new snapshots of your whole project.'
  ),
  new ChapterText('Let’s take a look at the different parts of Git.', { skip: true }),
  new ChapterText(
    'First, there is the Working Directory, the folder on your computer where all the files and folders of your project are stored in. Here you add, modify or delete files with other software like you are used to.'
  ),
];

@observer
class GitChapter extends Component {
  render() {
    const { chapter, tutorial } = this.props;

    return (
      <TutorialChapter tutorial={tutorial} chapter={chapter} sections={SECTIONS} />
    );
  }
}

export default GitChapter;

