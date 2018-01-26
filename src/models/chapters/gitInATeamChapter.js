import React, { Fragment } from 'react';
import { action as popmotionAction, chain } from 'popmotion';
import { action } from 'mobx';

import { createChapter, init, readOn } from '../Chapter';
import { ChapterText } from '../ChapterSection';
import Tooltip from '../../components/Tooltip';
import { actionQueue, delay } from './utils';

const gitInATeamChapter = createChapter('Git in a Team', {
  inheritFrom: 'Git in the Console',
  sections: [
    new ChapterText(() => (
      <Fragment>
        See the label at the last <Tooltip name="commit">commit</Tooltip> and
        the line connecting all the commits? That’s a branch. Git uses branches
        to support work in a team on different parts of your projects at the
        same time. A branch is basically a chain of commits. By default every
        Git project comes with a <code>master</code> branch.
      </Fragment>
    )),
    new ChapterText(() => (
      <Fragment>
        To work on a new feature we create a branch called{' '}
        <code>new-feature</code>. At the moment new commits are still added to
        the master branch though. Our new branch is not active. To change that,
        we need to activate <code>new-feature</code>.{' '}
        <em>This is called a checkout.</em>
      </Fragment>
    )),
    new ChapterText(() => (
      <Fragment>
        Once done, we can add new commits. Watch, how some other user just added
        some changes to the <code>master</code> branch. Might be a bugfix.
      </Fragment>
    )),
    new ChapterText(() => (
      <Fragment>
        Now, to merge the changes from both branches, we simply checkout the{' '}
        <code>master</code> branch again and merge our changes from{' '}
        <code>new-feature</code> into our currently active branch.
      </Fragment>
    )),
    new ChapterText(
      () => 'Not so difficult, right? Let’s get our hands dirty with …',
    ),
  ],
  get vis() {
    return this.parent.vis;
  },
  [init]() {
    this.vis.showBranches = true;
    this.actionQueue = actionQueue().start();

    this.createNewFeatureBranch = popmotionAction(({ complete }) => {
      console.log('new-feature create');
      this.vis.createBranch('new-feature');
      complete();
    });

    this.createCommit = popmotionAction(({ complete }) => {
      console.log('commit create');
      this.vis.createCommit();
      complete();
    });

    this.checkoutNewFeature = popmotionAction(({ complete }) => {
      console.log('new-feature checkout');
      this.vis.checkout('new-feature');
      complete();
    });

    this.checkoutMaster = popmotionAction(({ complete }) => {
      console.log('master checkout');
      this.vis.checkout('master');
      complete();
    });

    this.mergeNewFeature = popmotionAction(({ complete }) => {
      console.log('merge new feature');
      this.vis.merge('new-feature');
      complete();
    });
  },
  [readOn]() {
    if (!this.hasNewBranch) {
      this.hasNewBranch = true;

      this.actionQueue.add(delay(1000), this.createNewFeatureBranch);
    } else if (!this.checkoutNewBranch) {
      this.checkoutNewBranch = true;
      this.actionQueue.add(delay(1000), this.checkoutNewFeature);
    } else if (!this.createdNewCommits) {
      this.createdNewCommits = true;
      this.actionQueue.add(
        delay(1000),
        this.createCommit,
        delay(1000),
        this.createCommit,
        delay(1000),
        popmotionAction(
          action(({ complete }) => {
            chain(
              this.checkoutMaster,
              popmotionAction(({ complete }) => {
                console.log('commit create without reset');
                this.vis.createCommit(false);
                complete();
              }),
              this.checkoutNewFeature,
            ).start({ complete });
          }),
        ),
      );
    } else if (!this.mergeMaster) {
      this.mergeMaster = true;

      this.actionQueue.add(
        delay(1000),
        this.checkoutMaster,
        delay(1000),
        this.mergeNewFeature,
      );
    }
  },
});

export default gitInATeamChapter;
