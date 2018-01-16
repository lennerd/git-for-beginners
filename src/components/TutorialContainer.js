import React, { Component, createElement } from 'react';
import { inject, observer } from 'mobx-react';

import Tutorial, { TutorialReset } from './Tutorial';
import TutorialNavigation from './TutorialNavigation';
import TutorialHeader from './TutorialHeader';
import FontLoader from './FontLoader';

@inject('tutorial')
@observer
class TutorialContainer extends Component {
  render() {
    const { tutorial } = this.props;
    const { currentChapter } = tutorial;

    return (
      <Tutorial>
        <TutorialHeader tutorial={tutorial} />
        <TutorialNavigation tutorial={tutorial} />
        {<FontLoader>
          {(fonts) => (
            currentChapter.component != null &&
            createElement(currentChapter.component, {
              ...fonts,
              chapter: currentChapter,
              tutorial,
            })
          )}
        </FontLoader>}
        <TutorialReset onClick={tutorial.reset}>Reset</TutorialReset>
      </Tutorial>
    );
  }
}

export default TutorialContainer;
