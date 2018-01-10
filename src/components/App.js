import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Switch, Route, Redirect } from 'react-router-dom';

import TutorialContainer from './TutorialContainer';

const AppWrapper = styled.div`
  height: 100%;
`;

function App() {
  return (
    <AppWrapper>
      <Helmet titleTemplate="%s — Git for Beginners" defaultTitle="Git for Beginners" />
      <Switch>
        <Route path={`/chapters/:chapterId`} component={TutorialContainer} />
        <Redirect to={`/chapters/1`} />
      </Switch>
    </AppWrapper>
  );
}

export default App;
