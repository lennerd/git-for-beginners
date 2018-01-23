import React, { Component } from 'react';
import { observer } from 'mobx-react';

import Chapter, { ChapterMain } from './Chapter';
import ChapterHeader from './ChapterHeader';
import ChapterBody from './ChapterBody';
import ChapterNext from './ChapterNext';
import ChapterConsole from './ChapterConsole';
import ChapterVisualisation from './ChapterVisualisation';

@observer
class TutorialChapter extends Component {
  render() {
    const { chapter, tutorial, children, fontBlack, fontRegular, fontRegularCaps } = this.props;

    return (
      <Chapter>
        <ChapterMain>
          <ChapterHeader tutorial={tutorial} chapter={chapter} />
          <ChapterBody chapter={chapter} />
        </ChapterMain>
        {children}
        <ChapterConsole chapter={chapter} />
        <ChapterVisualisation chapter={chapter} fontBlack={fontBlack} fontRegular={fontRegular} fontRegularCaps={fontRegularCaps} />
        <ChapterNext tutorial={tutorial} chapter={chapter} />
      </Chapter>
    );
  }
}

export default TutorialChapter;
