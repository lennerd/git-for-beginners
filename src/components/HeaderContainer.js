import React from 'react';

import Title from './Title';
import Link from './Link';
import Header from './Header';

const TutorialTitle = Title.withComponent('h1');

function HeaderContainer({ chapter }) {
  return (
    <Header>
      <TutorialTitle>
        <Link to="/">Git for Beginners</Link>
      </TutorialTitle>
      <Title minor>{chapter.title}</Title>
    </Header>
  )
}

export default HeaderContainer;
