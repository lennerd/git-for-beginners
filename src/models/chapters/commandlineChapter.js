import React, { Fragment } from 'react';

import { createChapter, readOn } from '../Chapter';
import { ChapterText } from '../ChapterSection';
import TutorialChapter from '../../components/TutorialChapter';
import CommandlineVisualisation from '../../components/CommandlineVisualisation';

const commandlineChapter = createChapter('Command-line', {
  readOn: 0,
  hasPrompt: false,
  hasCommand: false,
  hasParameters: false,
  get component() {
    return props => (
      <TutorialChapter {...props}>
        <CommandlineVisualisation chapter={this} />
      </TutorialChapter>
    );
  },
  [readOn]() {
    this.readOn++;

    if (this.readOn >= 2) {
      this.hasPrompt = true;
    }

    if (this.readOn >= 3) {
      this.hasCommand = true;
    }

    if (this.readOn >= 4) {
      this.hasParameters = true;
    }
  },
  sections: [
    new ChapterText(() => (
      <Fragment>
        There is still an important part missing: the command-line or console,
        i.e. a text based controlling interface for your computer and the
        default way to work with Git. This may sound old fashioned but it really
        will speed up your workflow with Git, I promise.
      </Fragment>
    )),
    new ChapterText(() => (
      <Fragment>
        There are plenty of graphical interfaces for Git. But often these only
        support a subset of features. And after all, mastering the console will
        improve your abilities to use any kind of interface for Git.{' '}
        <em>
          It can be used to control nearly any software on your computer, not
          just Git.
        </em>
      </Fragment>
    )),
    new ChapterText(
      () => 'Let’s take a look at the differnt parts of the console.',
      { skip: true },
    ),
    new ChapterText(() => (
      <Fragment>
        The <strong>prompt</strong> indicates by a dollar sign that the console
        is ready for a new command. It’s often prefixed with the current path to
        help you to orientate.
      </Fragment>
    )),
    new ChapterText(() => (
      <Fragment>
        The prompt is followed by the <strong>command or program</strong> you
        want to execute with the command-line.
      </Fragment>
    )),
    new ChapterText(() => (
      <Fragment>
        By using <strong>sub commands and options</strong> you can provide
        parameters on how the command should be executed. The command decides
        how these parameters are interpreted.
      </Fragment>
    )),
    new ChapterText(() => (
      <Fragment>
        After the command is given you press the <em>enter</em> key on your
        keyboard and everything will be send to the command-line. Believe it or
        not, you’ll be amazed how easy it is, especially when having a visual
        model in mind of what is happening underneath.
      </Fragment>
    )),
  ],
});

export default commandlineChapter;
