import React, { Fragment } from 'react';

import { createChapter } from '../Chapter';
import { ChapterText, ChapterTask } from '../ChapterSection';
import Tooltip from '../../components/Tooltip';

const gitBranchesChapter = createChapter('Git Branches', {
  get sections() {
    return [
      new ChapterText(
        () => (
          <Fragment>
            Let’s do this again. This time again with using the{' '}
            <Tooltip name="console">console</Tooltip>.
          </Fragment>
        ),
        { skip: true },
      ),
      new ChapterTask(
        () => (
          <Fragment>
            Create a new <Tooltip name="branch">branch</Tooltip> with{' '}
            <code>git branch new-branch</code>
          </Fragment>
        ),
        true,
        {
          tip: () => (
            <Fragment>
              You can replace the name <code>new-branch</code> with what ever
              you like.{' '}
              <em>
                Keep in mind though that good branch names can help organize the
                work in your team.
              </em>
            </Fragment>
          ),
        },
      ),
      new ChapterTask(
        () => (
          <Fragment>
            Check out your <code>new-branch</code> branch with{' '}
            <code>git checkout new-branch</code> to activate it.
          </Fragment>
        ),
        true,
      ),
    ];
  },
});

export default gitBranchesChapter;
