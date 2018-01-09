import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Navigation, { NavigationProgressBar, NavigationList, NavigationItem, NavigationLink, NavigationIndicator, NavigationLabel } from './Navigation';
import Title from './Title';
import { selectChapters } from '../selectors/chapters';
import { selectTutorialProgress } from '../selectors/progress';

function NavigationContainer({ chapters, tutorialProgress }) {
  return (
    <Navigation>
      <NavigationProgressBar progress={tutorialProgress} />
      <NavigationList>
        {chapters.map((chapter, index) => (
          <NavigationItem key={index}>
            <NavigationLink to={`/chapter/${index + 1}`}>
              <NavigationIndicator active={(index / (chapters.length - 1)) <= tutorialProgress} />
              <NavigationLabel>
                {chapter.title}<br />
                <Title minor>{index + 1} / {chapters.length}</Title>
              </NavigationLabel>
            </NavigationLink>
          </NavigationItem>
        ))}
      </NavigationList>
    </Navigation>
  );
}

export default connect(
  createStructuredSelector({
    chapters: selectChapters,
    tutorialProgress: selectTutorialProgress,
  }),
)(NavigationContainer);
