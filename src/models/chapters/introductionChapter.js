import React, { Fragment } from 'react';

import { createChapter } from '../Chapter';
import { ChapterText } from '../ChapterSection';

const introductionChapter = createChapter('Introduction', {
  sections: [
    new ChapterText(() => (
      <Fragment>
        Over the passed decades computer in different shape and sizes changed
        our daily life enormously. Together we create huge amount of files
        everyday to store everything from invoices to love letters, from code to
        illustrations and designs.
      </Fragment>
    )),
    new ChapterText(() => (
      <Fragment>
        Although we create backups and store our files in clouds, data is lost
        frequently, because we accidentily deleted an old file or have
        overwritten a file a college had changed a few minutes before.<br />
        <em>
          No matter how hard we work on file name conventions and how many
          channels and notes we create to communicate to our self and our team,
          mistakes are made.
        </em>
      </Fragment>
    )),
    new ChapterText(() => (
      <Fragment>
        But not everything is lost (pun intended). Special version control
        systems can help to store versions of our project more effectily and
        give our team a better way of working on files together.
      </Fragment>
    )),
    new ChapterText(() => (
      <Fragment>
        Welcome to <strong>Git for Beginners</strong> – an interactive tutorial
        to learn and understand Git, a popular version control system to help
        you and your team to not loose data again.
      </Fragment>
    )),
    new ChapterText(
      () => 'Confused already? No worries. We start with the basics …',
    ),
  ],
});

export default introductionChapter;
