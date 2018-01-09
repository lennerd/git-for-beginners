import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Title from './Title';
import Link from './Link';
import Header from './Header';
import { selectCurrentChapter } from '../selectors/progress';

const TutorialTitle = Title.withComponent('h1');

function HeaderContainer({ className, currentChapter }) {
  return (
    <Header>
      <TutorialTitle>
        <Link to="/">
          Git for Beginners
        </Link>
      </TutorialTitle>
      <Title minor>{currentChapter.title}</Title>
    </Header>
  )
}

export default connect(
  createStructuredSelector({
    currentChapter: selectCurrentChapter,
  }),
)(HeaderContainer);
