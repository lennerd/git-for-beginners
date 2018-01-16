import React, { Component } from 'react';
import { observer } from 'mobx-react';

import Navigation, {
  NavigationProgressBar,
  NavigationList,
  NavigationItem,
  NavigationLink,
  NavigationIndicator,
  NavigationLabel
} from './Navigation';
import Title from './Title';

@observer
class TutorialNavigation extends Component {
  handleNavigationLinkClick(chapter) {
    const { tutorial } = this.props;

    tutorial.navigate(chapter);
  }

  render() {
    const { progress, chapters, currentChapter } = this.props.tutorial;

    if (currentChapter == null) {
      return null;
    }

    return (
      <Navigation>
        <NavigationProgressBar progress={progress} />
        <NavigationList>
          {chapters.map((chapter, index) => (
            <NavigationItem key={index}>
              <NavigationLink onClick={() => this.handleNavigationLinkClick(chapter)}>
                <NavigationIndicator active={(index / (chapters.length - 1)) <= progress} />
                <NavigationLabel>
                  {chapter.id}<br />
                  <Title minor>{index + 1} / {chapters.length}</Title>
                </NavigationLabel>
              </NavigationLink>
            </NavigationItem>
          ))}
        </NavigationList>
      </Navigation>
    );
  }
}

export default TutorialNavigation;
