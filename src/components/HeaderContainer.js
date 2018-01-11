import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import Title from './Title';
import Header, { HeaderTitle } from './Header';

@inject('tutorial')
@observer
class HeaderContainer extends Component {
  render() {
    const { currentChapter } = this.props.tutorial;

    return (
      <Header>
        <HeaderTitle>Git for Beginners</HeaderTitle>
        <Title minor>{currentChapter.title}</Title>
      </Header>
    );
  }
}

export default HeaderContainer;
