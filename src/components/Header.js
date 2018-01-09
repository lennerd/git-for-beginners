import React from 'react';
import styled from 'styled-components';

import Title from './Title';
import Link from './Link';

const TutorialTitle = Title.withComponent('h1');

function Header({ className, pageTitle }) {
  return (
    <div className={className}>
      <TutorialTitle>
        <Link to="/">
          Git for Beginners
        </Link>
      </TutorialTitle>
      <Title minor>{pageTitle}</Title>
    </div>
  )
}

export default styled(Header)`
  display: flex;
  align-self: center;
  justify-content: space-between;
  grid-area: header;
`;
