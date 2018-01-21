import React, { Fragment } from "react";

import { createChapter } from "../Chapter";
import { ChapterText } from "../ChapterSection";

const introductionChapter = createChapter('Introduction', {
  sections: [
    new ChapterText(() => (
      'Over the passed decades computer in different shape and sizes changed our daily life enormously. Together we create huge amount of data in form of files everyday to store everything from invoices to love letters, from code to illustrations and designs.'
    )),
    new ChapterText(() => (
      <Fragment>
        To prevent data loss we create backups and use clouds to store files and share data with others. Two people working on the same file is often impossible though. And after all, data is lost, because we accidentily deleted an old file or have overwritten a file a college had changed a few minutes before. <em>No matter how hard we work on file name conventions and how many channels we use to communicate in our team, mistakes are made.</em>
      </Fragment>
    )),
    new ChapterText(() => (
      'But not everything is lost (pun intended). Special version control systems can help to store versions of our project more effectily and give our team a better way of working on files together.'
    )),
    new ChapterText(() => (
      <Fragment>
        Welcome to <strong>Git for Beginners</strong> – an interactive tutorial to learn and understand Git, a popular version control system to help you and your team to not loose data again.
      </Fragment>
    )),
    new ChapterText(() => 'But let’s start by taking a look at …'),
  ],
});

export default introductionChapter;
