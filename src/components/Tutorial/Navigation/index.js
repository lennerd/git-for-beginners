import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import Container from '../../common/Container';
import NavigationItem from './NavigationItem';
import NavigationWrapper from './NavigationWrapper';
import NavigationTimeline from './NavigationTimeline';

@inject('tutorial')
@observer
class Navigation extends Component {
  render() {
    const { tutorial } = this.props;
    const { chapters } = tutorial;

    const navigationItems = chapters.map(chapter => (
      <NavigationItem key={chapter.index} chapter={chapter} />
    ));

    return (
      <Container>
        <NavigationWrapper>
          {navigationItems}
          <NavigationTimeline
            items={chapters.length}
            progress={tutorial.progress}
          />
        </NavigationWrapper>
      </Container>
    );
  }
}

export default Navigation;
