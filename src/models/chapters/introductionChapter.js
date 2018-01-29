import React, { Fragment } from 'react';

import { createChapter } from '../Chapter';
import { ChapterText } from '../ChapterSection';

const introductionChapter = createChapter('Introduction', {
  sections: [
    new ChapterText(
      () => (
        <Fragment>
          Over the past decades computers of different shapes and sizes have
          changed our daily life enormously. Everyday there is a huge amount of
          files created in order to store everything from invoices to love
          letters, from codes to illustrations and designs.
        </Fragment>
      ),
      { skip: true },
    ),
    new ChapterText(() => (
      <Fragment>
        Although lots of backups are created and files are stored in clouds data
        is lost frequently because you may have accidentily deleted an old file
        or overwritten a file a colleague had changed a few minutes ago.<br />
        <em>
          Regardless how hard we work on file name conventions and how many
          channels and notes we create to communicate to ourselves or to our
          team mistakes are made.
        </em>
      </Fragment>
    )),
    new ChapterText(() => (
      <Fragment>
        But not everything is lost (pun intended). Special version control
        systems can help you to store versions of your project more efficiently
        and offers your team a better way of working on files together.
      </Fragment>
    )),
    new ChapterText(
      () => (
        <Fragment>
          Welcome to <strong>Git for Beginners</strong> – an interactive
          tutorial to learn and understand Git, a popular version control system
          to help you and your team not to loose data again.
        </Fragment>
      ),
      { skip: true },
    ),
    new ChapterText(() => 'All set? Then let‘s start with the basics …'),
  ],
});

export default introductionChapter;
