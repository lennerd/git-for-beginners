import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';

import TutorialContainer from './TutorialContainer';

const AppWrapper = styled.div`
  height: 100%;
`;

function App() {
  return (
    <AppWrapper>
      <Helmet titleTemplate="%s — Git for Beginners" defaultTitle="Git for Beginners" />
      <TutorialContainer />
    </AppWrapper>
  );
}

export default App;
