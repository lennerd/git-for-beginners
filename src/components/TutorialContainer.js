import React, { Component, createElement } from 'react';
import { Helmet } from 'react-helmet';
import { inject, observer } from 'mobx-react';

import Tutorial from './Tutorial';
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
        <Helmet>
          <title>{tutorial.currentChapter.id}</title>
        </Helmet>
        <TutorialHeader tutorial={tutorial} />
        <TutorialNavigation tutorial={tutorial} />
        {
          <FontLoader>
            {fonts =>
              currentChapter.component != null &&
              createElement(currentChapter.component, {
                ...fonts,
                key: currentChapter.id,
                chapter: currentChapter,
                tutorial,
              })
            }
          </FontLoader>
        }
      </Tutorial>
    );
  }
}

export default TutorialContainer;
