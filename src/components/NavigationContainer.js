import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import Navigation, {
  NavigationProgressBar,
  NavigationList,
  NavigationItem,
  NavigationLink,
  NavigationIndicator,
  NavigationLabel
} from './Navigation';
import Title from './Title';

@inject('tutorial')
@observer
class NavigationContainer extends Component {
  handleClickNavigationLink(chapter) {
    const { tutorial } = this.props;

    tutorial.navigateToChapter(chapter);
  }
  render() {
    const { tutorial } = this.props;
    const { progress, chapters, currentChapter } = tutorial;

    if (currentChapter == null) {
      return null;
    }

    return (
      <Navigation>
        <NavigationProgressBar progress={progress} />
        <NavigationList>
          {chapters.map((chapter, index) => (
            <NavigationItem key={index}>
              <NavigationLink onClick={() => this.handleClickNavigationLink(chapter)}>
                <NavigationIndicator active={(index / (chapters.length - 1)) <= progress} />
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
}

export default NavigationContainer;
