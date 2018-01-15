import React, { PureComponent } from 'react';

import Chapter, { ChapterMain } from './Chapter';
import ChapterHeader from './ChapterHeader';
import ChapterBody from './ChapterBody';
import ChapterNext from './ChapterNext';

class TutorialChapter extends PureComponent {
  render() {
    const { chapter, tutorial, sections, children, onReadOn } = this.props;

    return (
      <Chapter>
        <ChapterMain>
          <ChapterHeader tutorial={tutorial} chapter={chapter} />
          <ChapterBody chapter={chapter} sections={sections} onReadOn={onReadOn} />
        </ChapterMain>
        {children}
        <ChapterNext tutorial={tutorial} chapter={chapter} />
      </Chapter>
    );
  }
}

export default TutorialChapter;
