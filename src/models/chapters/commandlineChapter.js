import React, { Fragment } from 'react';

import { createChapter, readOn } from '../Chapter';
import { ChapterText } from '../ChapterSection';
import TutorialChapter from '../../components/TutorialChapter';
import CommandlineVisualisation from '../../components/CommandlineVisualisation';

const commandlineChapter = createChapter('Commandline', {
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
        One important part is still missing: the commandline or console, a text
        based controlling interface for your computer. This may sound old
        fashioned, but mastering it will speed up your workflow with Git
        enourmusly, I promise.
      </Fragment>
    )),
    new ChapterText(() => (
      <Fragment>
        There are plenty of graphical interfaces for Git. But often these only
        support a subset of features. And after all, mastering the console will
        improve your abilities to use any kind of interface for Git. It’s like
        using a graphical user interface, just without buttons and dialogs.{' '}
        <em>
          It can be used to control nearly every software on your computer, not
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
        The <strong>prompt</strong> indicates that the console is ready to take
        in a new command. It’s often prefixed with the current path or logged in
        user, to help you orientate.
      </Fragment>
    )),
    new ChapterText(() => (
      <Fragment>
        The prompt is followed by a <strong>command or program</strong> you want
        to call.
      </Fragment>
    )),
    new ChapterText(() => (
      <Fragment>
        By using <strong>sub commands and options</strong> you can provide
        parameters on how the command should be executed. It’s up to the command
        how these parameters are interpreted.
      </Fragment>
    )),
    new ChapterText(() => (
      <Fragment>
        When you’re ready you press the <em>enter</em> key on your keyboard to
        send everything to the command. Bare with me, you’ll be amazed how easy
        it is to use, especially with a visual model in mind of what is
        happening underneath.
      </Fragment>
    )),
  ],
});

export default commandlineChapter;
