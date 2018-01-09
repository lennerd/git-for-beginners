import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Switch, Route, Redirect } from 'react-router-dom';

import Tutorial, { Main } from './Tutorial';
import NavigationContainer from './NavigationContainer';
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
          <Switch>
            <Route path={`/chapters/:chapterId`} component={ChapterContainer} />
            <Redirect to={`/chapters/1`} />
          </Switch>
        </Main>
      </Tutorial>
    </AppWrapper>
  );
}

export default App;
