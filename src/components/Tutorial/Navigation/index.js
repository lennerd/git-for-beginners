import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import Container from '../../common/Container';
import NavigationItem from './NavigationItem';
import NavigationWrapper from './NavigationWrapper';
import NavigationTimeline from './NavigationTimeline';

@inject('tutorial', 'chapter')
@observer
class Navigation extends Component {
  render() {
    const { tutorial, chapter: currentChapter } = this.props;
    const { chapters } = tutorial;

    const navigationItems = chapters.map(chapter => (
      <NavigationItem
        key={chapter.id}
        to={`/chapter/${chapter.id}`}
        done={tutorial.done(chapter, currentChapter)}
      >
          {chapter.title}
      </NavigationItem>
    ));

    return (
      <Container>
        <NavigationWrapper>
          {navigationItems}
          <NavigationTimeline
            items={chapters.length}
            progress={tutorial.progress(currentChapter)}
          />
        </NavigationWrapper>
      </Container>
    );
  }
}

export default Navigation;
