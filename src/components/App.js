import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';

import Tutorial from './Tutorial';
import NavigationContainer from './NavigationContainer';
import Main from './Main';
import ChapterContainer from './ChapterContainer';
import HeaderContainer from './HeaderContainer';

const AppWrapper = styled.div`
  height: 100%;
`;

function App() {
  return (
    <AppWrapper>
      <Helmet titleTemplate="%s — Git for Beginners" defaultTitle="Git for Beginners" />
      <Tutorial>
        <HeaderContainer />
        <NavigationContainer />
        <Main>
          <ChapterContainer />
        </Main>
      </Tutorial>
    </AppWrapper>
  );
}

export default App;
