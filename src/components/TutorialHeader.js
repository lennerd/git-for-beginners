import React, { Component } from 'react';
import { observer } from 'mobx-react';

import Title from './Title';
import Header, { HeaderTitle } from './Header';

@observer
class TutorialHeader extends Component {
  render() {
    const { currentChapter } = this.props.tutorial;

    return (
      <Header>
        <HeaderTitle>Git for Beginners</HeaderTitle>
        <Title minor>{currentChapter && currentChapter.title}</Title>
      </Header>
    );
  }
}

export default TutorialHeader;
