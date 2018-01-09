import React from 'react';
import styled from 'styled-components';

const TutorialWrapper = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 90px repeat(12, auto) 90px;
  grid-template-rows: 90px auto 90px;
  grid-template-areas:
    ". header header header header header header header header header header header header ."
    "navigation . . main main main main . . . . . . .";
  background-image: linear-gradient(135deg, #FEF6F5 0%, #C5CDF6 100%);

  .header {
    grid-area: header;
    border: 1px solid red;
  }

  .navigation {
    grid-area: navigation;
    border: 1px solid red;
  }

  .main {
    grid-area: main;
    border: 1px solid red;
  }
`;

function Tutorial() {
  return (
    <TutorialWrapper>
      <div className="header">Header</div>
      <div className="navigation">Navigation</div>
      <div className="main">Main</div>
    </TutorialWrapper>
  );
}

export default Tutorial;
